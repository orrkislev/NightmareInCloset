updatePage()

levels = []
for (let i=0;i<harryPotterWords.length;i+=2){
    levels.push([harryPotterWords[i], harryPotterWords[i+1]])
}
$("#slider").attr('max',levels.length-1)

function updatePage(){
    allHtml = ""
    originalTexts.forEach((txt)=>{
        allHtml += "<div>"+getTranslatedTextHtml(txt)+"</div>"
    })
    $("#text").html(allHtml)
    $('.special').tooltip()
}

function getTranslatedTextHtml(txt) {
    txtParts = []

    level = $("#slider").val()
    if (level == -1) {
        txtParts = [{ "text": txt, "special": false }]
    } else {
        phrases = []
        for (let i = 0; i <= level; i++) {
            phrases.push(levels[i])
        }
        rgx = ''
        phrases.forEach(phrase => {
            rgx = rgx + "|" + phrase[0]
        });
        rgx = rgx.substr(1)
        rgx = "(" + rgx + ")"
        rgx = new RegExp(rgx, 'g');
        txt = txt.split(rgx)
        txt.forEach((part) => {
            txtParts.push({ "text": part, "special": false, 'original':null })
        })

        phrases.forEach(phrase => {
            txtParts.forEach((part) => {
                if (part.text == phrase[0]) {
                    part.text = phrase[1]
                    part.special = true
                    part.original = phrase[0]
                }
            })
        });
    }
    txtHtml = ""
    txtParts.forEach((part) => {
        if (part.special) {
            txtHtml += "<span class=special title='" + part.original + "'>" + part.text + "</span>"
        } else {
            txtHtml += part.text
        }
        // txtHtml += " "
    })
    return txtHtml
}   

$('body').click(function(e) {
    if ($('#slidecontainer').is(":hidden")) {
        $('#slidecontainer').show()
        $('#slidecontainer').css("right",$(window).width()- e.pageX)
        $('#slidecontainer').css("top",e.pageY)
    } else {
        $('#slidecontainer').hide()
    }
});