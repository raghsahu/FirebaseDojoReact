import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export async function getLikesIds(callback) {
    const user = auth().currentUser;
    const ref = await firestore().collection('likeBooks')
        .doc(user.email).collection('ids').get()
    ref.forEach(documentSnapshot => {
        var data = documentSnapshot.data()
        var ids = JSON.parse(data.value)
        callback(ids)
    })
}

export function setLike(book, LikedBooksIDS, callback) {
    if (book && book.id) {
        const user = auth().currentUser;
        try {
            var ids = LikedBooksIDS
            if (ids.includes(book.id)) {
                var updatedID = ids.filter((e) => e != book.id)
                callback(updatedID)
    
                firestore()
                    .collection('likeBooks')
                    .doc(user.email)
                    .collection('ids')
                    .doc('values')
                    .set({
                        value: JSON.stringify(updatedID)
                    })
    
                firestore().collection('likeBooks')
                    .doc(user.email)
                    .collection('books')
                    .doc(book.id)
                    .delete()
            }
            else {
                ids.push(book.id)
                var updatedID = ids.filter((e) => e != '')
                callback(updatedID)
    
                firestore()
                    .collection('likeBooks')
                    .doc(user.email)
                    .collection('ids')
                    .doc('values')
                    .set({
                        value: JSON.stringify(ids)
                    })
    
                firestore().collection('likeBooks')
                    .doc(user.email)
                    .collection('books')
                    .doc(book.id)
                    .set({
                        book: book
                    }).then(() => {
    
                    });
            }
        }
        catch (e) {
            console.log(e)
        }
    } 
}