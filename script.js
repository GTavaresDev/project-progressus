const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checKoutBtn = document.getElementById("chekout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("personalise")
const addressWarn = document.getElementById("addres-warn")
const abrirInsta = document.getElementById("abrir-insta")

let cart = [];


// Adicionando o evento de quando clicar em veja meu carrinho vai abrir o display de finalizar a compra 
cartBtn.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"
})

// Adicionando o evento de quando clicar fora vai fechar o evento a cima do carrinho 
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Adicionando o evento de quando clicar no botão "fechar" vai fechar o carrinho
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

// Adicionando o evento de quando clicar no carrinho ao lado serviço vai adicionar ao carrinho
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //Adiocionar no carrinho
        addToCart(name, price)
    }
})


// Função para adicionar no carrinho 
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        // Se o item já existir apenas aumentará +1 unidade
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

// Atualizando o carrinho com os items
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
            <p class="font-medium">${item.name} </p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>          
        </div>
        `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement)
       
    })
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })
    cartCounter.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCard(name);
    }
    
})
function removeItemCard(name){
    const index = cart.findIndex (item => item.name === name)
    if(index !== -1){
       const item = cart[index]
       if(item.quantity > 1){
        item.quantity -= 1
        updateCartModal()
        return
       }
       cart.splice(index, 1 )
       updateCartModal()
       
    }
} 

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    // Agora se eu escrever algo no personalise a borda vermelha some
    if(inputValue !== "" ){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }



})

//Finalizar pedido
checKoutBtn.addEventListener("click", function(){
    // Verificar se há itens no carrinho
    if (cart.length === 0) {
        return;
    }

    // Verificar se o campo de endereço está vazio
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return; // Se o campo estiver vazio, não prosseguir com o pedido
    }

    // Montar a mensagem com os itens do carrinho
    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    }).join("");

    // Codificar a mensagem e o número de telefone
    const message = encodeURIComponent(cartItems);
    const phone = "62994279139";

    // Abrir o WhatsApp com a mensagem e informações adicionais
    window.open(`https://wa.me/${phone}?text=${message}%20Informações%20Adicionais:%20${addressInput.value}`, "_blank");

    // Limpar o carrinho após o pedido ser enviado
    cart = [];
    updateCartModal(); // Função para atualizar a exibição do carrinho, se necessário
});




//Adicionando verificação se o pedido está sendo feito durante o horario de fucionamento
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    const diaDaSemana = data.getDay(); // 0 (Domingo) a 6 (Sábado)

    // Restringir o horário de segunda a sexta-feira, das 9h às 18h
    const estaAberto = (diaDaSemana >= 1 && diaDaSemana <= 5) && (hora >= 9 && hora < 18);
    
    return estaAberto;
    // True = Estamos aberto
}

//Aqui vai verrificar o horario se não estivermos aberto a tarja vai ficar vermelha
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-700")
}else{
    spanItem.classList.remove("bg-green-700")
    spanItem.classList.add("bg-red-500")
}

// Criando o clique do insta 
 abrirInsta.addEventListener("click", function () {
    window.open("https://www.instagram.com/progressuswebs/") 
})
