// author talk that is good aproach in writing js code.
document.addEventListener("DOMContentLoaded" , function(){
let a = 10;
a +=10;
console.log(a);

const loadContent = async (url, callback) => {
    await fetch(url)
        .then(response =>  response.json())
        .then(json => createElement(json.goods));    
    callback();
};

function createElement(arr){
    const goodsWrapper = document.querySelector('.goods__wrapper');
    arr.forEach(function(item){
        let card = document.createElement('div');
        card.classList.add('goods__item');
        card.innerHTML = `
            <img class="goods__img" src="${item.url}" alt="phone">
            <div class="goods__colors">Доступно цветов: 4</div>
            <div class="goods__title">
                ${item.title}
            </div>
            <div class="goods__price">
                <span>${item.price}</span> руб/шт
            </div>
            <button class="goods__btn">Добавить в корзину</button>
        `;
        goodsWrapper.appendChild(card);
    });
}

loadContent('http://127.0.0.1:5500/src/js/db.json', () => {
    const cartWrapper = document.querySelector(".cart__wrapper"),
    cart = document.querySelector(".cart"),
    close = document.querySelector(".cart__close"),
    open = document.querySelector("#cart"),
    goodsBtn = document.querySelectorAll(".goods__btn"),
    products = document.querySelectorAll(".goods__item"),
    confirm = document.querySelector(".confirm"),
    badge = document.querySelector(".nav__badge"),
    totalCost = document.querySelector(".cart__total > span"),
    titles = document.querySelectorAll(".goods__title");

function openCart() {
    cart.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cart.style.display = "none";
    document.body.style.overflow = "";
}

open.addEventListener("click", openCart);
// в основному вся робота js зводиться до того що у нас є елементи на сайті, до них ми відслідковуємо собития. І на собития вішаєм обробники.
// Коротко вся суть native js - записана вище.

close.addEventListener("click",closeCart);

goodsBtn.forEach(function(btn,i) {
    btn.addEventListener("click", () => {
        let item = products[i].cloneNode(true),
            trigger = item.querySelector("button"),
            removeBtn = document.createElement("div"),
            empty = cartWrapper.querySelector(".empty");
        trigger.remove();
        showConfirm();
        removeBtn.classList.add("goods__item-remove");
        removeBtn.innerHTML = '&times';
        item.appendChild(removeBtn);
        cartWrapper.appendChild(item);
        if (empty) {
            empty.remove();
        }
        calcGoods();
        calcTotal();
        removeFromCart();
    });
});
 
function sliceTitle(){
    titles.forEach(function(item){
        if (item.textContent.length < 70) {
             return;
        }
        else {
            const str = item.textContent.slice(0, 71) + '...';
            item.textContent = str;
        }
  });
}
sliceTitle();

function showConfirm(){
    confirm.style.display = "block";
    let counter = 100;
    const id = setInterval(frame,10);
    function frame() {
        if (counter == 10) {
            clearInterval(id);
            confirm.style.display = "none";
        }
        else {
            counter--;
            confirm.style.transform = `translateY(-${counter}px)`;
            confirm.style.opacity = '.' + counter;
        }
    }
}

function calcGoods() {
    const items = cartWrapper.querySelectorAll(".goods__item");
    badge.textContent =  items.length;
}

function calcTotal(){
    const prices = document.querySelectorAll(".cart__wrapper > .goods__item > .goods__price > span");
    let total = 0;
    prices.forEach(function(item){
         total += +item.textContent;
    });
    totalCost.textContent = total;
}

function removeFromCart(){
    const removeBtn = cartWrapper.querySelectorAll('.goods__item-remove');
    removeBtn.forEach(function(btn){
         btn.addEventListener("click",() => {
             btn.parentElement.remove();
             calcGoods();
             calcTotal();
         });
    });
}
});

});


// проблема асинхроності. Потрібно дуже бути уважним на рахунок асихроності, та памятати як працює event loop.

// У нашому прикладі - спочатку виконається код в середині функції обробника події - DOMContentLoaded а потім уже довиконуються проміси у fetch - і ми рендеримо дані на сторінку.

// async await - появилася у ES7 стандарті.




//анімація на чистому js - зараз пишуть все меньше і меньше, тому що css3 - дає непоганий функціонал по створенню анімації і кращий функціонал.


// потрібно вішати обробники подій на елемент в той момент, коли він створився. Приклад з даного проекту - це елементи (goods__item-remove).

// у js функції - не запоминають стан останнього виконання функції. Тобто при наступному визові, всі дані знову обнулені(аналогічно як і у інших мовах програмування).




// Приклад , який доказує те, що хоть і конструктція async await - виглядає як код, який виконується асинхронно. Насправді, це не так. А async await, просто являється синтаксичним сахаром для then. Тому конструкції перед якими пишеться await - все одна ставляться в event loop queue , а потім уже попадають до стеку визовів, коли він вільний.

// console.log("First");
// (async function(){
//     let response = await fetch('http://127.0.0.1:5500/src/js/db.json')
//     console.log(response);
//     let res = await response.json();
//     console.log(res);
//     console.log("Fi");  // але в середині async функції - ми отримуємо цілковитту асинхроність.
// })();
// console.log("Second");
// console.log("Third");

