// Load wink-nlp package.
const winkNLP = require( 'wink-nlp' );
const model = require( 'wink-eng-lite-web-model' );
const nlp = winkNLP( model );
const its = nlp.its;
const as = nlp.as;

const characterTextReplace = (req, character) => {
    const text = req.text || req;

    //Lisa response handling
    if (character === "lisa") {
        let result = text;

        result = result.replace(/\[name\]/gi, " Lisa ")
            .replace(/\[quote\]/gi, " I live with the my family and I hate Bart. BART!! ")
            .replace(/\[age\]/gi, " 8 ")
            .replace(/\[description\]/gi, " don't you think we ought to attack the roots of our social problems instead of jamming people into overcrowded prisons")
            .replace(/\[birthday\]/gi, "9th May")
            .replace(/\[job\]/gi, "Student")
            .replace(/\[background\]/gi, "I am the middle child and most accomplished of my family")
            .replace(/\[home\]/gi, "742 Evergreen Terrace")
            .replace(/\[backstory\]/gi, "I am quite eclectic in my knowledge and I am notably more concerned with world affairs and problems than my cohorts")
        return result;
    }

    //pos expression handling
    const patterns = [
        {name: 'adpVerbAdp', patterns: ["ADP [|VERB] [|ADP]"]},
        {name: 'verbAdp', patterns: ["VERB [|ADP]"]},
        {name: 'propns', patterns: ["PROPN"]}
    ]
    nlp.learnCustomEntities(patterns);

    const doc = nlp.readDoc(text);

    //farfriend grammar structure
    const yodaGrammar = {DET:0, NUM:1, propns:2, INTJ: 3, adpVerbAdp:4, verbAdp:5, ADP:6, ADJ:7, NOUN:8, X:9, SCONJ:10, PRON:11, AUX:12, ADV: 13, CCONJ: 14, PUNC:15, SYM:16}
    const stitchGrammar = {PRON:0, NUM:1, INTJ: 2, propns:3, adpVerbAdp:4, verbAdp:5, ADP:6, ADJ:7, NOUN:8, DET:9, SCONJ:10, ADV: 13, CCONJ: 14, PUNC:15, SYM:16, X:17}

    const grammarSheet = character === "yoda" ? yodaGrammar : stitchGrammar

    let sentenceElements = []

    //iterate by sentence
    const sentences = doc.sentences().each((x, i) => {
        let currentSentence;

        //custom type mapping
        if (x.customEntities().out(its.detail)[0]) {
            const customType = x.customEntities().out(its.detail)[0].type
            const customValue = x.customEntities().out(its.detail)[0].value
            currentSentence = [{[customType]: [customValue]}]
        } else {
            currentSentence = []
        }
        
        const pos = x.tokens().out(its.pos);
        const value = x.tokens().out();

        //farfriend sets
        const yodaSet = [...new Set(pos.filter(x => x!= "ADP" && x!= "VERB" && x !== "PUNCT"))]
        const stitchSet = [...new Set(pos.filter(x => x !== "PUNCT" && x !== "AUX" && x !== "INTJ"))]
        const tokenSet = character === "yoda" ? yodaSet : stitchSet

        //other type mapping
        const valueMap = tokenSet.map(q => {
            let setObj =  {[q]: []}
            value.map((e,r) => {
                if (pos[r] === q) {
                    setObj[q].push(e)
                }
            })
            return currentSentence.push(setObj)
        });

        //sentence sorting for farfriend grammar
        let accum = 1
        const newCurrent = currentSentence.sort((t,y) => {
            for (let a in t) {
                for (let s in y) {
                    return grammarSheet[a] < grammarSheet[s] ? -1 : 2
                }
            }
        })

        let index = 0
        let columnSentence = []

        //index mapping for sub-sentences
        for (i in newCurrent) {
            const currentIndex = [...Object.values(newCurrent[i])[0]].length
            index = currentIndex > index ? currentIndex : index
        }

        //sub-sentence value mapping
        let punct = []
        for (let i = 0; i < index; i++) {
            let currentColumn = []
            for (let j in newCurrent) {
                const currentIndex = [...Object.values(newCurrent[j])[0]];
                const currentKey = [Object.keys(newCurrent[j])[0]][0];
                if (j == newCurrent.length-1 && currentIndex === "what" || j == newCurrent.length-1 && currentIndex === "you" || j == newCurrent.length-1 && currentIndex === "i") {
                    break;
                } else {
                    currentIndex[i] && currentColumn.push(currentIndex[i].toLowerCase())
                    // console.log(`currentKey: ${currentKey}, currentIndex: ${currentIndex}`)
                }
            }
            columnSentence.push(...currentColumn)
        }
        
        columnSentence.push(".");
        columnSentence[0] = columnSentence[0][0].toUpperCase() + columnSentence[0].slice(1,)
        sentenceElements.push(...columnSentence)
    });

    //pretty print
    let arrManipulation = sentenceElements.reduce((o,x,i) => {
        console.log(`xa: ${x}`)
        if (i === sentenceElements.length-1) {
        return o = o.slice(0,-1) + `${x}`
        } 
        o += `${x} `
        return o
    },"")

    //farfriend regex
    if (character === "yoda") {
        arrManipulation = arrManipulation.replace(/(human$|\Wyou\W$|person$)/gi, " young padawan")
        .replace(/(human|\Wyou\W|person)/gi, " young padawan ")
        .replace(/(\Wme\W|\Wi\W|myself)/gi, " Yoda ")
        .replace(/name/gi, "Yoda my name is.")
        .replace(/quote/gi, " May the force be with you")
        .replace(/age/gi, " 900")
        .replace(/birthday/gi, "Secret that is, though born in the year 41 BBY I was")
        .replace(/description/gi, " Darkness awaits you though the jedi shall also")
        .replace(/job/gi, "Jedi")
        .replace(/background/gi, "Yoda be legendary Jedi Master and led Jedi Order against Sith")
        .replace(/home/gi, "896 BBY")
        .replace(/backstory/gi, "For 800 years have I trained Jedi")
    } else {
        arrManipulation = arrManipulation.replace(/(human|\Wyou\W|person)/gi, " Human ")
        .replace(/(\Wme\W|\Wi\W|myself|name|^i)/gi, " Stitch ")
        .replace(/quote/gi, " Aloha ")
        .replace(/age/gi, " 26 June")
        .replace(/birthday/gi, "Secret that is, though born in the year 41 BBY I was")
        .replace(/description/gi, " Ohana means family, family means nobody gets left behind or forgotten ")
        .replace(/job/gi, "Lilo Friend")
        .replace(/background/gi, "Stitch not bad. Stitch fluffy!")
        .replace(/home/gi, "No home.")
        .replace(/backstory/gi, "This is my family. I found it, all on my own. It's little, and broken, but still good. Yeah. Still good.")
    }

    return arrManipulation

}

module.exports = {characterTextReplace}