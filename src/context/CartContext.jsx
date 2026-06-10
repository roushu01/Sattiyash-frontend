import React,{
createContext,
useContext,
useState,
useEffect,
} from "react";

const CartContext =
createContext();

export const useCart=
()=>useContext(
CartContext
);

export const CartProvider=
({
children,
})=>{

const [cart,
setCart]=
useState([]);

const [wishlist,
setWishlist]=
useState([]);


// LOAD DATA
useEffect(()=>{

const savedCart=
JSON.parse(
localStorage.getItem(
"cart"
)
)||[];

const savedWishlist=
JSON.parse(
localStorage.getItem(
"wishlist"
)
)||[];

setCart(
savedCart
);

setWishlist(
savedWishlist
);

},[]);


// SAVE CART
useEffect(()=>{

localStorage.setItem(
"cart",
JSON.stringify(
cart
));

},[cart]);


// SAVE WISHLIST
useEffect(()=>{

localStorage.setItem(
"wishlist",
JSON.stringify(
wishlist
));

},[wishlist]);


// ADD
const addToCart=
(product)=>{

setCart(
(prev)=>[
...prev,
product,
]
);

};

const addToWishlist=
(product)=>{

if(
!wishlist.find(
item=>
item.id===
product.id
)
){

setWishlist(
(prev)=>[
...prev,
product,
]
);

}

};


// REMOVE
const removeFromCart=
(id)=>{

setCart(
(prev)=>
prev.filter(
item=>
item.id!==id
)
);

};

const removeFromWishlist=
(id)=>{

setWishlist(
(prev)=>
prev.filter(
item=>
item.id!==id
)
);

};


// CLEAR EVERYTHING
const clearAllUserData=
()=>{

setCart([]);

setWishlist([]);

localStorage.removeItem(
"cart"
);

localStorage.removeItem(
"wishlist"
);

sessionStorage.clear();

};


return(

<CartContext.Provider
value={{

cart,
wishlist,

setCart,
setWishlist,

addToCart,
addToWishlist,

removeFromCart,
removeFromWishlist,

clearAllUserData,

}}
>

{children}

</CartContext.Provider>

);

};