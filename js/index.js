let userFullName = "";
let productId = null;
const productCardContainer = document.querySelector('.product-card-container');

const fetchUserDetail = async () => {
    try {
        const apiEndpoint = 'http://localhost:8080/api/ecom/web-service/user/detail';

        const dataToSend = {
            username: 'test_system',
            password: 'test'
        };

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(dataToSend)
        }).then((httpResponse) => httpResponse.json());

        localStorage.setItem('userId', response.data.id);
        userFullName = 'คุณ' + response.data.name + ' ' + response.data.surname;

    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

const fetchNewArrivalProduct = async () => {

    try {
        const apiEndpoint = 'http://localhost:8080/api/ecom/web-service/product/newArrival';

        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((httpResponse) => httpResponse.json());

        let products = response.data;

        for(let i = 0; i< products.length; i++){
            createProductCard(
                products[i].id,
                products[i].name,
                products[i].shortDetail,
                products[i].price,
                products[i].image
            );
        }

    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const createProductCard = (prodId, prodName, prodDetail, prodPrice, prodImg) => {

    // Create product card
    const productCardDiv = document.createElement('div');
    productCardDiv.classList.add('product-card');

    // Create product image section
    const productCardImgDiv = document.createElement('div');
    productCardImgDiv.classList.add('product-card-img');

    const productImg = document.createElement('img');
    productImg.classList.add('product-img');
    productImg.src = prodImg;
    productImg.alt = prodDetail;

    productCardImgDiv.appendChild(productImg);

    // Create product detail section
    const productDetailDiv = document.createElement('div');
    productDetailDiv.classList.add('product-detail');

    const productName = document.createElement('p');
    productName.classList.add('product-name');
    productName.textContent = prodName;

    const productDetailShort = document.createElement('p');
    productDetailShort.classList.add('product-detail-short');

    let detail = prodDetail != "" ? prodDetail : "ไม่พบข้อมูลรายละเอียดสินค้า กรุณาติดต่อร้านค้า"
    productDetailShort.textContent = detail;

    productDetailDiv.appendChild(productName);
    productDetailDiv.appendChild(productDetailShort);

    // Create product price section
    const productPriceContainerDiv = document.createElement('div');
    productPriceContainerDiv.classList.add('product-price-container');

    const productPrice = document.createElement('p');
    productPrice.classList.add('product-price');
    productPrice.textContent = Intl.NumberFormat().format(prodPrice) + ' บาท';

    productPriceContainerDiv.appendChild(productPrice);

    // Create product card button
    const productCardButtonDiv = document.createElement('div');
    productCardButtonDiv.classList.add('product-card-button');

    const productMoreDetail = document.createElement('p');
    productMoreDetail.classList.add('product-more-detail');
    productMoreDetail.textContent = 'รายละเอียด';

    productCardButtonDiv.onclick = function() {
        localStorage.setItem('productId', JSON.stringify(prodId));
        window.location.href = 'page/productDetail.html'
    };
    
    productCardButtonDiv.appendChild(productMoreDetail);

    // Append all created elements to the product card div
    productCardDiv.appendChild(productCardImgDiv);
    productCardDiv.appendChild(productDetailDiv);
    productCardDiv.appendChild(productPriceContainerDiv);
    productCardDiv.appendChild(productCardButtonDiv);

    productCardContainer.appendChild(productCardDiv);
}

async function init() {
    await fetchUserDetail();
    document.getElementById('user-detail').textContent = userFullName;

    await fetchNewArrivalProduct();
}

init();
