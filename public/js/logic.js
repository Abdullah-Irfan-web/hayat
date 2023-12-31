function pdf(){
    const ele=document.getElementById("elements");
    const opts = {
      margin:1,
        filename :'result.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          backgroundColor: "#fff",
          scale: window.devicePixelRatio,
          y: 0,
          x: 0,
          scrollY: 0,
          scrollX: 0,
          windowWidth: 460,
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
    html2pdf()
    .set(opts)
    .from(ele)
   
    .save()
}