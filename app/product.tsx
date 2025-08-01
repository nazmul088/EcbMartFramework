import { Button } from "@react-navigation/elements";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { environment } from "./environments/environment";

export interface Product {
  id?: string | number;
  name?: string;
  description?: string;
  price?: number;
  svgImage?: string;
  quantity?: number;
}

function getSvgXml(svgImage?: string) {
  return `data:image/png;base64,${svgImage}`;
}

interface ShowProductsProps {
  addedToCart: Product[];
  setAddedToCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ShowProducts({ addedToCart, setAddedToCart }: ShowProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${environment.apiUrl}/api/product`);
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  function handleCartAction(product: Product) {
    const isAdded = addedToCart?.some((p) => p.id === product.id);
    if (isAdded) {
      setAddedToCart((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setAddedToCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  }

  return (
    <View style={styles.container}>
      {products.map((product, idx) => {
        const isAdded = addedToCart?.some((p) => p.id === product.id);
        return (
          <View key={product.id || idx} style={styles.productCard}>
            <Image
              source={{ uri: getSvgXml(product.svgImage) }}
              style={styles.productImage}
            />
            <Text style={styles.productName}>{product.name || "No Name"}</Text>
            <Text style={styles.description}>{product.description || ""}</Text>
            <Text style={styles.productPrice}>
              {product.price ? `${product.price} Tk` : ""}
            </Text>
            <Button
              onPress={() => {
                handleCartAction(product);
              }}
              style={isAdded ? [styles.addToCartButton, styles.removeFromCartButton] : styles.addToCartButton}
              color="white"
            >
              {isAdded ? "Remove from cart" : "Add to Cart"}
            </Button>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  productCard: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
    flexDirection: "column",
    width: 184,
    gap: 4,
  },
  productImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  productName: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  productPrice: {
    color: "green",
    marginTop: 4,
  },
  addToCartButton: {
    padding: 8,
    color: "white",
    backgroundColor: "#32CCBC",
    borderRadius: 4,
    cursor: "pointer",
    width: 166,
  },
  removeFromCartButton: {
    backgroundColor: '#FF5252', // red for remove
  },
});
