const { onRequest, onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// admin SDK
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Filter, Firestore } = require("firebase-admin/firestore");
const { getMessaging } = require('firebase-admin/messaging');

initializeApp()

// Gemini
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: "AIzaSyBgNOPaH7o7ucE3dToukYO0h1aQXkBNrvE" });

// exports.addDocument = onCall(async (request) => {
//   const text = request.data.text
//   try {
//     const res = await getFirestore().collection('test').add({ text: text })
//     return '書き込みました'
//   } catch(err) {
//     return err
//   }
// })
exports.notificationToQuestioner = onCall(async (request) => {
  const registrationTokens = []

  try {
    // background notification
    const querySnapshot = await getFirestore().collection('tokens').where(Filter.where('uid', '==', request.data.uid)).get()
    querySnapshot.forEach(doc => {
      registrationTokens.push(doc.data().token)
    })

    console.log(registrationTokens)
    
    const message = {
      tokens: registrationTokens,
      notification: {
        title: 'あなたの質問に１件の回答がありました',
        body: request.data.questionTitle
      },
      data: {
        isbn: request.data.isbn,
        id: request.data.id
      },
    };

    if(registrationTokens.length !== 0) {
      await getMessaging().sendEachForMulticast(message)
    }

    // foreground notifition
    await getFirestore().collection('notifications').add({
      uid: request.data.uid,
      isbn: request.data.isbn,
      documentId: request.data.documentId,
      title: request.data.questionTitle,
      isNotified: false,
      answerer: request.auth.uid,
      answererName: request.auth.token.name,
      createAt: Firestore.FieldValue.serverTimestamp()
    })

  } catch (err) {
    console.log(err.message)
  }

})

exports.saveToken = onCall(async (request) => {
  try {
    const token = request.data.token
    const uid = request.data.uid
    const documentId = token.substr(0, token.indexOf(':'))

    const res = await getFirestore().doc(`tokens/${ documentId }`).set({
      uid: uid,
      token: token,
      createAt: Firestore.FieldValue.serverTimestamp()
    })
  } catch (err) {
    console.log(err.message)
  }
})

exports.deleteToken = onCall(async (request) => {
  try {
    const token = request.data.token
    const documentId = token.substr(0, token.indexOf(':'))

    const res = await getFirestore().doc(`tokens/${ documentId }`).delete()
  } catch (err) {
    console.log(err.message)
  }
})

// gemini
exports.createText = onCall(async (request) => {
  const contents = `${request.data.title}の著者${request.data.author}を説明する記事を作成してください。タイトルは${request.data.author}。形式はHTML、bodyタグ内に埋め込むためのコードを書いてください。CSSはインラインスタイル、liタグのlist-style-typeはnone、h1,h2,h3タグには上下に適当なマージンを設定してください。コードのみを出力して、私との対話を含めないでください。`
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    return response.text.replace(/```html\n?|```/g, '').trim();
  } catch(err) {
    console.log(err.message);
  }
})