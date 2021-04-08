document.addEventListener("DOMContentLoaded", () => {
    const goodsWrapper = document.querySelector('.goods__wrapper');
    const cartOpen = document.querySelector('#cart');
    const cart = document.querySelector('.cart');
    const cartClose = document.querySelector('.cart__close');
    const cartWrapper = document.querySelector('.cart__wrapper');
    const empty = document.querySelector('.empty');
    const badge = document.querySelector('.nav__badge');
    const totalPrice = document.querySelector('.cart__total');
    async function loadGoods(url,callback) {
        await fetch(url)
            .then(response => response.json())
            .then(result => renderGoods(result.goods));
        callback();
    }
    
    function renderGoods(goodsList){
        let goodsListFragment = '';
        goodsList.forEach((item) => {
            goodsListFragment += `
            <div class="goods__item">
            <img class="goods__img" src="${item.url}" alt="phone">
            <div class="goods__colors">Доступно цветов: 4</div>
            <div class="goods__title">
                ${item.title}
            </div>
            <div class="goods__price">
                <span>${item.price}</span> руб/шт
            </div>
            <button class="goods__btn">Добавить в корзину</button>
            </div>
            `;
        });
        goodsWrapper.innerHTML = goodsListFragment;
    }

    loadGoods('http://127.0.0.1:5500/training/js/db.json', () => {
        function sliceTitle(){
            const titles = document.querySelectorAll('.goods__title');
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
        function openCart(){
            cart.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        function closeCart(){
            cart.style.display = '';
            document.body.style.overflow = '';
        }

        function badgeCount(){
            badge.textContent = cartWrapper.children.length;
        }

        function totalPriceCount(){
            totalPrice.textContent = Array.from(cartWrapper.children).reduce((acc,item) => {
                let price = item.querySelector('.goods__price span');
                let priceValue = price.textContent;
                acc += +priceValue;
                return acc;
            },0);
            
        }

        cartOpen.addEventListener("click",openCart);
        cartClose.addEventListener("click",closeCart);

        goodsWrapper.addEventListener("click", ({target} = e) => {
            if(target.nodeName === "BUTTON"){
                let goodsItem = target.parentElement;
                let goodsItemClone = goodsItem.cloneNode(true);
                let goodsItemCloneButton = goodsItemClone.querySelector('.goods__btn');
                goodsItemCloneButton.remove();
                const closeBtn = document.createElement("div");
                closeBtn.innerHTML = "&times";
                closeBtn.classList.add('goods__item-remove');
                goodsItemClone.prepend(closeBtn);
                cartWrapper.addEventListener("click", ({target} = e) => {
                    if(target.nodeName === "DIV" && target.classList.contains('goods__item-remove')){
                        let goodsItem = target.parentElement;
                        goodsItem.remove();
                        badgeCount();
                        totalPriceCount();
                    }
                });
                if(empty) {
                    empty.remove();
                }
                cartWrapper.prepend(goodsItemClone);
                badgeCount();
                totalPriceCount();
            }
        });
    });
});