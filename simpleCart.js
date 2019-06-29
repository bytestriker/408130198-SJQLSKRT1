$.simpleCart  = ({
  'uuidv4' : function() {return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);});},
  'myAccount' : function(){
    if (localStorage.getItem('account') == 'undefined' || localStorage.getItem('account') == null) {
      var s = $.simpleCart.owner();
      localStorage.setItem('account', s);
      localStorage.setItem('empty', false);
      localStorage.setItem('products', JSON.stringify([]))
    }
  },
  'numberWithCommas':function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  'owner' : function(){
    localStorage.setItem('empty', true);
    return $.simpleCart.uuidv4();
  },
  'counter':function(){
    var products = JSON.parse(localStorage.getItem('products'));
    if (products) {
      var tmp = 0;
      $.each(products, function(i, v){
        tmp += v.qty;
      })
      $('#cart-counter').empty().html(tmp).fadeIn();
    }
  },
  'activity': function(){
    var products = JSON.parse(localStorage.getItem('products'));
    if (products) {
      var li = '';
      $.each(products, function(i, v){
        li += '<tr>';
        li += '<td width="45%"><span class="status status-success item-before"></span> <a href="#">'+v.name+'</a></td>';
        li += '<td width="15%"><span class="text-smaller text-semibold">$ '+$.simpleCart.numberWithCommas(v.price)+'</span></td>';
        li += '<td width="15%" class="text-center"><span class="label label-info">'+v.qty+'</span></td>';
        li += '<td width="15%" class="text-center"><span class="label label-info">'+v.qty+'</span></td>';
        li += '</tr>';
      });
    }
    $('#product-list').empty().html(li);
  },
  'addProduct' : function(rec, show_cart){
    $.simpleCart.myAccount();
    var products = JSON.parse(localStorage.getItem('products'));
    console.info(products);
    var $data = $(rec).data();
    console.info($data);
    var p_det = { uuid: $.simpleCart.uuidv4(), course_id : $data.course_id, name : $data.name,
      price : $data.price, qty : $data.qty, discount: $data.discount,
      begin: $data.begin, end: $data.end, author: $data.author, category : $data.category
    };
    if (products.length == 0) {
      // EVERY THING IS NEW
      var existents = [];
      // console.info('first article ');
      products.push(p_det);
      localStorage.setItem('products', JSON.stringify(products));
      existents.push(parseInt(p_det.course_id));
      localStorage.removeItem('existents');
      localStorage.setItem('existents', JSON.stringify(existents));
    }else{
      var products = JSON.parse(localStorage.getItem('products'));
      var existents = JSON.parse(localStorage.getItem('existents'));
      var vf = jQuery.inArray(p_det.course_id, existents); // veryFederation
      console.warn(vf);
      if (vf == -1) {
        // console.log("new");
        products.push(p_det);
        localStorage.removeItem('products');
        localStorage.setItem('products', JSON.stringify(products));
        existents.push(parseInt(p_det.course_id));
        localStorage.removeItem('existents');
        localStorage.setItem('existents', JSON.stringify(existents));
      } else if (vf >= 0) {
        var dupe = products.pop(vf);
        // console.info("veryFederation: ", vf, " => Producto Duplicado <= ", dupe.course_id);
        dupe.qty = dupe.qty + 1;
        products.push(dupe);
        localStorage.removeItem('products');
        localStorage.setItem('products', JSON.stringify(products));
      }
    }
    $.simpleCart.counter();
    $.simpleCart.activity();
    if (show_cart) {
      $.simpleCart.showCart();
    }
  },
  'deleteProduct' : function(uuid, show_cart){
    var products = JSON.parse(localStorage.getItem('products'));
    var curr = '';
    $.each(products, function(i, v){
      if (v.uuid == uuid) {
        curr = products.pop(i);
        return false;
      }
    });
    // console.info("curr: ", curr);
    if (curr.qty > 1) {
      curr.qty = curr.qty -1;
      products.push(curr);
    }
    localStorage.removeItem('products');
    localStorage.setItem('products', JSON.stringify(products));
    $.simpleCart.counter();
    $.simpleCart.activity();
    if (show_cart) {
      // location.reload();
      $.simpleCart.showCart();
    }

  },

  'showCart': function(){
    $('#shoppings').empty();
    var data = JSON.parse(localStorage.getItem('products'));
    var html = '';
    var subtotal = 0;
    var discount = 0;
    var total = 0;
    if( !data) return false;
    $.each(data, function(i, v){
      var data_article = '';
      data_article += 'data-course_id="'+v.course_id+'"';
      data_article += 'data-name="'+v.name+'"';
      data_article += 'data-price="'+v.price+'"';
      data_article += 'data-discount="'+v.discount+'"';
      data_article += 'data-begin="'+v.begin+'"';
      data_article += 'data-end="'+v.end+'"';
      data_article += 'data-author="'+v.author+'"';
      data_article += 'data-category="'+v.category+'"';
      data_article += 'data-qty="1"';
      var html = '';
      html += '<tr>';
      html += '<td><a href="#" ';
      html += data_article;
      html += 'onclick="$.simpleCart.addProduct(this, true);"><i class="icon-plus-circle"></i></a></td>';
      html += '<td><a href="#" ';
      // html += data_article;
      html += ' onclick="$.simpleCart.deleteProduct(\''+v.uuid+'\', true)"><i class="icon-minus-circle"></i></a></td>';
      html += '<td>'+v.name+'</td>';
      html += '<td>'+v.author+'</td>';
      html += '<td>'+v.begin+'</td>';
      html += '<td>'+v.end+'</td>';
      html += '<td>'+v.qty+'</td>';
      html += '<td>$ '+$.simpleCart.numberWithCommas(v.price)+'</td>';
      subtotal += (v.qty * v.price);
      html += '<td>$ '+$.simpleCart.numberWithCommas(v.discount)+'</td>';
      discount += v.discount;
      var sbt = (v.qty * v.price) - v.discount;
      html += '<td>$ '+$.simpleCart.numberWithCommas(sbt)+'</td>';
      total += sbt;
      html += '</tr>';
      $('#shoppings').append(html);
    });
    $('#invoice-elements').empty().html(data.length);
    $('#inv-subtotal').empty().html('$ ' + $.simpleCart.numberWithCommas(subtotal));
    $('#inv-descuento').empty().html('$ ' + $.simpleCart.numberWithCommas(discount));
    $('#inv-total').empty().html('$ ' + $.simpleCart.numberWithCommas(total));

  },
  'clear' : function(){
    if (confirm('Deseas eliminar todas tus compras?')) {
      localStorage.clear();
      window.location = '/';
    }
  }
});
console.info("localStorage ", localStorage);
(function(){

  $.simpleCart.counter();
  $.simpleCart.activity();
})();
