# 408130198-SJQLSKRT1

___
As simple as possible. 

a) $.simpleCart variable stores a JSON with functions.

b) You add the method "onClick="javascript:$.simpleCart.addProduct(this);" on the click event of the desired element and don't forget to place the data-element related to the product, something like «data-product-name="{{$row->name}}"»

c) You add the html element's ID for the list of "added products" to the cart in the "$.simpleCart.activity()" method.

d) You place the $.simpleCart.js just before </body> tag.



** You can test the result of the script opening the browser's console and adding console.info() for debuggin.** 
Once you get the $.simpleCart running, feel free to get the elements of the ca
