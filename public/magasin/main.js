function download(filename) {
  $.getJSON("/public/magasin/json/" + filename + ".json", (data) => {
    var element = document.createElement('a');
  
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
    element.setAttribute('download', filename + ".json");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  });
}
