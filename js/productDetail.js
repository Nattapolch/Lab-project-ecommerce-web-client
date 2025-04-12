let plusButton = document.getElementById('plus-button');
let minusButton = document.getElementById('minus-button');
let numberOfProductInOrder = document.getElementById('number-of-product-in-order');
let buyNowButton = document.getElementById('buy-now-button');
plusButton.addEventListener("click",function(){
    numberOfProductInOrder.innerHTML = parseInt(numberOfProductInOrder.innerHTML) + 1;
    let totalPrice = parseInt(localStorage.getItem('price')) * parseInt(numberOfProductInOrder.innerHTML);
    document.getElementById('product-total-price').innerHTML = Intl.NumberFormat('th-TH').format(totalPrice) + ' บาท';
    localStorage.setItem('totalPrice', totalPrice)
    localStorage.setItem('Selectquantity', numberOfProductInOrder.innerHTML);
})
minusButton.addEventListener("click",function(){
    if(parseInt(numberOfProductInOrder.innerHTML) > 1){
        numberOfProductInOrder.innerHTML = parseInt(numberOfProductInOrder.innerHTML) - 1;
        let totalPrice = parseInt(localStorage.getItem('price')) * parseInt(numberOfProductInOrder.innerHTML);
        document.getElementById('product-total-price').innerHTML = Intl.NumberFormat('th-TH').format(totalPrice) + ' บาท';
        localStorage.setItem('totalPrice', totalPrice)
        localStorage.setItem('Selectquantity', numberOfProductInOrder.innerHTML);
    }else{
        alert('จำนวนสินค้าต้องไม่น้อยกว่า 1 ชิ้น');
    }
})
buyNowButton.addEventListener("click",function(){
    if(parseInt(numberOfProductInOrder.innerHTML) > parseInt(localStorage.getItem('quantity'))){
        alert('จำนวนสินค้าในStock ไม่เพียงพอ');
    }else{
        createOrder();
    }
})
const fetchProductDetail = async () => {
    try{

        const productId = localStorage.getItem('productId');
        const apiEndpoint = 'http://localhost:8080/api/ecom/web-service/product/'+productId;
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((httpResponse) => httpResponse.json());
        let products = response.data;
        console.log(products);
        localStorage.setItem('price', response.data.price)
        localStorage.setItem('quantity', response.data.quantity)
        localStorage.setItem('productName', response.data.name)

        
        document.getElementById('display-product-image').src = products.image;
        document.getElementById('product-title').textContent = products.name;
        document.getElementById('product-detail').textContent = products.detail;
        document.getElementById('product-total-price').textContent = Intl.NumberFormat().format(products.price) + ' บาท';

        localStorage.setItem('Selectquantity', 1);
        localStorage.setItem("totalPrice",products.price)
        numberOfProductInOrder.innerHTML = 1;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}
const createOrder = async () => {
    try{

        const productId = localStorage.getItem('productId');
        const productName = localStorage.getItem('productName');
        const totalPrice = parseInt(localStorage.getItem('totalPrice'));
        const Selectquantity = parseInt(localStorage.getItem('Selectquantity'));
        const price = parseInt(localStorage.getItem('price'));
        const userId = parseInt(localStorage.getItem('userId'));
        const orderData = {
            "items": [
                {
                    "id": productId,
                    "name": productName,
                    "price": price,
                    "quantity": Selectquantity,
                    "total_price": totalPrice
                }
            ],
            "orderBy": userId
    };
        const apiEndpoint = 'http://localhost:8080/api/ecom/web-service/order/create';
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })  
        if(response.ok){
            alert('สำเร็จสั่งซื้อสินค้า');
        }else{
            alert('ไม่สำเร็จสั่งซื้อสินค้า');
        }
    }catch(error){
        console.error('Error creating order:', error.message);
    }
}
fetchProductDetail();
