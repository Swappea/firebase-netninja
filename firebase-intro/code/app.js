const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
const search = document.querySelector('#search');

// create element and render cafe
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        // get id of parent li element which gives us document id which we setup earlier
        let id = e.target.parentElement.getAttribute('data-id');

        // get single document by id
        db.collection('cafes').doc(id).delete();
    });
}

search.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        if (e.target.value) {
            cafeList.innerHTML = '';
            // here we can do greater than or less than and various operators
            db.collection('cafes').orderBy('name').where('city', '==', e.target.value).get()
                .then((snapshot) => {
                    // we receive a snapshot of db
                    snapshot.docs.forEach(doc => {
                        renderCafe(doc);
                    });
                });
        } else {
            cafeList.innerHTML = '';
            db.collection('cafes').orderBy('name').get()
                .then((snapshot) => {
                    // we receive a snapshot of db
                    snapshot.docs.forEach(doc => {
                        renderCafe(doc);
                    });
                });
        }

    }
})

// get reference to collection and get documents
// this is async request and it returns promise
// db.collection('cafes').orderBy('name').get()
//     .then((snapshot) => {
//         // we receive a snapshot of db
//         snapshot.docs.forEach(doc => {
//             renderCafe(doc);
//         });
//     });


// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});


// real time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') {
            renderCafe(change.doc);
        } else if (change.type === 'removed') {
            let li = cafeList.querySelector(`[data-id="${change.doc.id}"]`);
            cafeList.removeChild(li);
        }
    });
});


// updating data
// db.collection('cafes').doc('XZbl5ToN3VrAl7zllXYP')
//     .update({
//         name: 'Marios Toadstool'
//     })

// update vs set
// set will override whole document

// db.collection('cafes').doc('XZbl5ToN3VrAl7zllXYP')
//     .set({
//         name: 'Marios Toadstool'
//     })