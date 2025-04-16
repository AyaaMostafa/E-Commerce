import { fetchProducts, loadDataToHtml } from './fetchProducts.js'


let loadData = async () => {
  const data = await fetchProducts("dessert", "iceCream");
  console.log(data);
  return data;
};

loadData().then(res => {
  console.log(res);

  loadDataToHtml(res.items);
});