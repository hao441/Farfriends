const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const qna = require('@tensorflow-models/qna');
const fs = require('fs');

const smallTalk = require('./data/smallTalk.json');
const contextAnswers = require('./data/contextAnswers.json');
const { characterTextReplace } = require('./replaceText.js');


//preprocessing
const preSmallTalk = smallTalk.map(x => {
  let preIntent = x['Intent'].replace(/(smalltalk_agent_|smalltalk\w)/g,"")
  preIntent = preIntent.replace(/_/g, " ")

  return {utterance: x['Utterances'], intent: preIntent};
})

const preContextAnswers = contextAnswers.map((x,i) => {
    let user = x['intent'];
    let ai = x['response'];

    ai = !ai.replace(/(.$|,|\?|!)/g,".")

    return {user: user, ai: ai, index: i}
})


//intent mapping
const intentMap = preSmallTalk.reduce((o,x) => {
  if (!o.includes(x['intent'])) {
      return [...o, x['intent']]
  }
  return o
}, []).map((x,i) => {return {intent: x, id: i}});


// MODEL //

//model classification
const MODEL_NAME = "farfriend-model";
const N_CLASSES = intentMap[intentMap.length-1].id+1;

//model encoder
const encodeData = async (talks) => {
  const encoder = await use.load();
  const sentences = talks.map(t => t.utterance.toLowerCase())
  const embeddings = await encoder.embed(sentences);
  return embeddings
}

//model training
const trainModel = async () => {
  try {
      const loadedModel = await tf.loadLayersModel(
          `file://./bin/${MODEL_NAME}/model.json`
      )
      console.log("Using existing model");
      return loadedModel
  } catch (err) {
      console.log("Training new model");
  }
  
  // document.getElementById("vis-label").innerHTML = `Training Model...`;

  //zeros
  const xTrain = await encodeData(preSmallTalk);
  const yTrain = tf.tensor2d(preSmallTalk.map(t => intentMap.map(x => t.intent === x.intent ? 1 : 0)))

  console.log("finished zeros");

  //model creation
  const model = tf.sequential();

  console.log("finished zero creation");

  console.log(N_CLASSES)

  model.add(
      tf.layers.dense({
          inputShape: [xTrain.shape[1]],
          activation: "softmax",
          units: N_CLASSES
      })
  );

  console.log("finished zeros");


  model.compile({
      loss: "categoricalCrossentropy",
      optimizer: tf.train.adam(0.001),
      metrics: ["accuracy"]
  });

  console.log("finished compile");

  console.log("finished loss Container assign");

  function onEpochEnd(epoch, logs) {
    // document.getElementById("vis-label").innerHTML = `Model Accuracy: ${Math.round(logs.acc * 100)}%`;
    console.log('Accuracy', `${Math.round(logs.acc * 100)} %`);
  }


  await model.fit(xTrain, yTrain, {
      batchSize: 32,
      validationSplit: 0.1,
      shuffle: true,
      epochs: 100,
      callbacks: {onEpochEnd}
  });

  // document.getElementById("vis-label").innerHTML = `Saving Model...`;


  await model.save(`file://./bin/${MODEL_NAME}`);

  console.log("finished model");


  return model;
};

const farFriendResponse = async (message, model, character) => {

  //model settings
    const threshold = 0.75;
    const encodedMessage = await encodeData([{ utterance: message}]);
    const loadedModel = await tf.loadLayersModel(
      `file://./bin/${MODEL_NAME}/model.json`
  )

    const prediction = await loadedModel.predict(encodedMessage).data();
  
    // console.log(prediction);
  
    const answer = prediction.reduce((o,x, i) => {
      o = x > o ? x : o
      prediction.indexOf(o)
      return o
    });
    const answerIndex = prediction.indexOf(answer);
    
    //fallbacks
    const fallBacks = ["I am sorry. I do not understand the question.", "Can you please rephrase this question. I am not sure what you mean.", "I am very sorry. Not sure what you mean by this."];
    
    //create preprocessed response
    let preResponse;
    
    if (answer > threshold) {
      preResponse =  contextAnswers.find(x => x.intent === intentMap[answerIndex].intent).response
    } else {
      const qnaLoad = await qna.load();

      const context = character === "yoda" ? 
      fs.readFileSync('./data/yodaContext.txt', 'utf8') :
      character === "lisa" ?
      fs.readFileSync('./data/lisaContext.txt', 'utf8') :
      fs.readFileSync('./data/stitchContext.txt', 'utf8')

      const answers = await qnaLoad.findAnswers(message, context);

      preResponse = answers[0] ? answers[0] : fallBacks[(Math.floor(Math.random() * ((fallBacks.length-1) - 0) + 0))]
    }


    // return preResponse
    const postResponse = characterTextReplace(preResponse,character)

    return postResponse
  }


module.exports =  { farFriendResponse, trainModel, encodeData, intentMap}
