// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./Auth";
// import { BASE_URL } from "../../config.js";

// export const StoreContext = createContext();

// export const useStore = () => {
//     return useContext(StoreContext);
// }

// export const StoreContextProvider = ({children}) => {
//     const [products, setProducts] = useState([]);

//     const {authorization} = useAuth();

//     const updateProduct = (updatedProduct) => {
//       setProducts((prevProducts) => prevProducts.map(product =>
//         product._id === updatedProduct._id ? updatedProduct : product
//       ));
//     };

//     const getAllProductListing = async (e) => {
//         try {
//           const response = await fetch(`${BASE_URL}/api/yoga/products/get`, {
//             method: "GET",
//             headers: {
//               Authorization: authorization
//             }
//           })
    
//           const data = await response.json();
//           // console.log(data.products);
//           // console.log(user);
    
//           if (response.ok) {
//             setProducts(data.products);
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       }
    
//       useEffect(() => {
//         getAllProductListing();
//       }, [products])

//     return (
//         <StoreContext.Provider value={{products, setProducts, updateProduct}}>
//             {children}
//         </StoreContext.Provider>
//     )
// }

