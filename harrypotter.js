$("#text").html(originalText)

levels = []
for (let i=0;i<harryPotterWords.length;i+=2){
    levels.push([harryPotterWords[i], harryPotterWords[i+1]])
}
$("#slider").attr('max',levels.length-1)

function updateText() {
    txtParts = []

    level = $("#slider").val()
    if (level == -1) {
        txtParts = [{ "text": originalText, "special": false }]
    } else {
        phrases = []
        for (let i = level; i >= 0; i--) {
            phrases.push(levels[i])
        }
        rgx = ''
        phrases.forEach(phrase => {
            rgx = rgx + "|" + phrase[0]
        });
        rgx = rgx.substr(1)
        rgx = "(" + rgx + ")"
        rgx = new RegExp(rgx, 'g');
        txt = originalText.split(rgx)
        txt.forEach((part) => {
            txtParts.push({ "text": part, "special": false })
        })

        phrases.forEach(phrase => {
            txtParts.forEach((part) => {
                if (part.text == phrase[0]) {
                    part.text = phrase[1]
                    part.special = true
                }
            })
        });
    }
    txtHtml = ""
    txtParts.forEach((part) => {
        if (part.special) {
            txtHtml += "<span class=special>" + part.text + "</span>"
        } else {
            txtHtml += part.text
        }
        // txtHtml += " "
    })
    $("#text").html(txtHtml)
}

$('#overlay').click(function(e) {
    if ($('#slidecontainer').is(":hidden")) {
        $('#slidecontainer').show()
        $('#slidecontainer').css("right",$(window).width()- e.pageX)
        $('#slidecontainer').css("top",e.pageY)
    } else {
        $('#slidecontainer').hide()
    }
});