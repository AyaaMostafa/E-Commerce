
import {loadDataToHtml} from './fetchProducts.js'

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Initialize Bootstrap carousel after content is loaded
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 2000
    });
}


// Example: get all documents from a collection
async function fetchHomeProducts() {
    let homeData = [];
    const querySnapshot = await getDocs(collection(db, "food"));
    let allItems = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // دمج كل العناصر من المصفوفات داخل المستند
        for (let key in data) {
            if (Array.isArray(data[key])) {
                allItems = allItems.concat(data[key]);
            }
        }
    });

    //console.log(allItems);
    

    let count = 15;

    for (let i = 0; i < count; i++)
    {
        let randomIndex = Math.floor(Math.random() * allItems.length);
        if(!homeData.includes(allItems[randomIndex]))
        {
            let item = allItems[randomIndex];
            homeData.push(item);
        }
        else
            i--;

    }
    
    return homeData;
 }



 let loadData = async () => {
    let homeData = await fetchHomeProducts();
    return homeData;
}

loadData().then(res => {
    loadDataToHtml(res);
    //console.log(res);
});

