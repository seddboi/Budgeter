let database;

const budgetRequest = indexedDB.open('budget', 1);

budgetRequest.onerror = () => {
    console.log('Please try again!')
};

budgetRequest.onupgradeneeded = (event) => {
    database = event.target.result;

    database.createObjectStore('pending', {autoIncrement:true});
};

budgetRequest.onsuccess = (event) => {
    database = event.target.result;

    if (navigator.onLine) {
        getData();
    }
};

function saveData(data) {
    const transaction = database.transaction(['pending'], 'readwrite');

    const storeTransaction = transaction.objectStore('pending');

    storeTransaction.add(data);
};

function getData() {
    const transaction = database.transaction(['pending'], 'readwrite');

    const storeTransaction = transaction.objectStore('pending');

    const gatherData = storeTransaction.getAll();

    gatherData.onsuccess = () => {
        if (gatherData.result.length > 0) {
            fetch("/api/transactions/bulk", {
                method:'POST', 
                body: JSON.stringify(gatherData.result),
                headers: {
                    Accept: 'application/json , text/plain', 'Content-Type': 'application/json' 
                },
            }).then( (response) => {
                response.json();

                const transaction = database.transaction(['pending'], 'readwrite');

                const storeTransaction = transaction.objectStore('pending');

                storeTransaction.clear();
            });
        }
    }
};

