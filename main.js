
//Libreria Sweet Alert
import Swal from "sweetalert2";

function mensajeAgregarCarrito (){
  
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
   });
  Toast.fire({
    icon: "success",
    title: "Producto agregado"
  });
}



//promesas - mensaje vaciar carrito

function mensajeProductoEliminado (){

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
   });
  Toast.fire({
    icon: "success",
    title: "Producto Elimininado"
  });
 


}



// element html DOM
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment();
let carrito = {}



//ejecuta consumo api
document.addEventListener('DOMContentLoaded', () => {
  fetchData();

 //Condicional que verifica si hay datos en local storage 
  if (localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito"))
    pintarCarrito();
  }

});


//eventos boton 

cards.addEventListener("click", (e) => {
  addCarrito(e)
})

// evento sumar productos
items.addEventListener ("click", e => { 
  btnAccion(e)
})

//consumo api local asyn 
const fetchData = async () => {

    try {
            const res = await fetch('api.json');
            const data = await res.json();
            //console.log(data);
            pintarCards(data)
    } catch (error) {
       
      console.log(error);
    }

}

//pinta las tarjetas de los productos en el front
const pintarCards = data => {
  data.forEach(producto => {
    const clone = templateCard.cloneNode(true);
    clone.querySelector('h5').textContent = producto.title;
    clone.querySelector('p').textContent = producto.precio; 
    clone.querySelector('img').setAttribute("src", producto.thumbnailUrl)
    clone.querySelector('.btn-dark').dataset.id = producto.id
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
}

const addCarrito = e => {
  //console.log(e.target)
  //console.log(e.target.classList.contains("btn-dark"))

  //condicional
  if(e.target.classList.contains("btn-dark")){
   
   //console.log(e.target.parentElement)
   setCarrito(e.target.parentElement)
  }

  e.stopPropagation()
}

const setCarrito = objeto => {

 const producto ={
  id: objeto.querySelector(".btn-dark").dataset.id,
  title: objeto.querySelector('h5').textContent,
  precio: objeto.querySelector('p').textContent,
  cantidad: 1
} 


// aumenta la cantidad de productos
//console.log (producto)
if (carrito.hasOwnProperty(producto.id)){
  producto.cantidad = carrito[producto.id].cantidad + 1
}

//genera una copia del obje con spreed oparation
carrito[producto.id] = {...producto}
pintarCarrito();
console.log(carrito);
mensajeAgregarCarrito();

}

const pintarCarrito = () => {
  //console.log(carrito);
items.innerHTML = ""
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.title
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
    //botones
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)

    
  })

  items.appendChild(fragment)
  pintarFooter()
   // funcion que guarda el carrito en local storage
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

const pintarFooter = () => {

  footer.innerHTML = " "
  if (Object.keys(carrito).length === 0){
    footer.innerHTML =  `
    <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
    `
    return
  }

  // sumar cantidad y sumar totales
  const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
  //console.log(nPrecio)



  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)

  footer.appendChild(fragment)

  // funcion vaciar carrito
  const boton = document.querySelector('#vaciar-carrito')
  
  
  // promesa mensaje
  boton.addEventListener('click', () => {
  
    Swal.fire({
      title: "vaciar carrito de compra",
      text: "¿Esta seguro que desea vaciar carrito de compra?",
      icon: "warning",
      confirmButtonText: "Si",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red"
    }).then( res => {
     // verifica la accion de la promesa
     if(res.isConfirmed){
      console.log("confirmo vaciar carrito")
      
      Swal.fire({
        title: "Carrito vacio",
        icon: "success",
        
      })

  // funciones para vaciar el carrito
  carrito = {}
  pintarCarrito()

     }
     
     if(res.isDismissed){
      Swal.fire({title: "Seguir comprando"})
      console.log("Carrito lleno")
     }

    })


  
  })

}


const btnAccion = e => {
 
  if (e.target.classList.contains('btn-info')){
    //console.log(carrito[e.target.dataset.id])
    const producto = carrito[e.target.dataset.id]
    producto.cantidad++
    carrito[e.target.dataset.id] = {...producto}
    pintarCarrito()
  }

  if (e.target.classList.contains('btn-danger')){
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--

    if(producto.cantidad === 0){

      delete carrito[e.target.dataset.id]
      mensajeProductoEliminado()
    }
    pintarCarrito()
  }

e.stopPropagation()

}


