import { Badge, Drawer, Grid, LinearProgress } from '@material-ui/core';
import { info, log } from 'console';
import { useQuery } from 'react-query';
import { StyledButton, Wrapper } from './App.styles';
import Item from './item/Item';
import { useState } from 'react';
import Cart from './cart/Cart';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CartItem from './cartItem/CartItem';



export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

function App() {
  const {data ,isLoading,error} = useQuery<CartItemType[]>('product',getProducts);

  const [cartopen,setCartOpen] = useState(false);
  const [cartItems,setCartItems] = useState([] as CartItemType[]);

  console.log('---->',data);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(previousState => {
     
      const isItemInCart = previousState.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return previousState.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      
      return [...previousState, { ...clickedItem, amount: 1 }];
    });
  };
    
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };
  


  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((accumulator: number, item) => accumulator + item.amount, 0);

  if (isLoading) return <LinearProgress/>;
  if (error) return <>Something went wrong ...</>;

  return (
   <Wrapper>
     <Drawer anchor='right' open={cartopen} onClick={() => setCartOpen(!true)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon/>
        </Badge>
      </StyledButton>
     <Grid container spacing={3}>
     {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
        </Grid>
   </Wrapper>
  );
}

export default App;
