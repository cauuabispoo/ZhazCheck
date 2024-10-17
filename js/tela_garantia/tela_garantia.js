// Inicialização da custom select
$(".custom-select").each(function () {
    var classes = $(this).attr("class"),
        id = $(this).attr("id"),
        name = $(this).attr("name");

    var template = '<div class="' + classes + '">';
    template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + "</span>";
    template += '<div class="custom-options">';

    $(this).find("option").each(function () {
        template += '<span class="custom-option" data-value="' + $(this).attr("value") + '">' + $(this).html() + "</span>";
    });

    template += "</div></div>";

    $(this).wrap('<div class="custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
});

// Função para manipular a abertura e fechamento do select customizado
$(".custom-select-trigger").on("click", function (event) {
    const select = $(this).parents(".custom-select");

    // Fecha todos os selects abertos, exceto o que foi clicado
    $(".custom-select").not(select).removeClass("opened");

    // Alterna a classe 'opened' no select atual
    select.toggleClass("opened");
    
    $("html").one("click", function () {
        select.removeClass("opened");
    });

    event.stopPropagation();
});

// Função para manipular a seleção de uma opção
$(".custom-option").on("click", function () {
    var selectedValue = $(this).data("value");
    var $selectWrapper = $(this).parents(".custom-select-wrapper");
    var $select = $selectWrapper.find("select");

    // Atualiza o valor do select escondido
    $select.val(selectedValue);
    $selectWrapper.find(".custom-option").removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".custom-select").removeClass("opened");
    $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());

    // Lógica separada para cada select
    if ($select.attr('id') === 'response') {
        handleResponse(selectedValue);
    } else if ($select.attr('id') === 'lacre') {
        handleLacre(selectedValue);
    }
});

// Função para manipular a lógica do select "response"
function handleResponse(selectedValue) {
    if (selectedValue === "nao") {
        $("#additionalContent").removeClass("hidden1"); // Mostra o conteúdo adicional
        // Chame aqui a função para mostrar o conteúdo específico baseado no que foi selecionado
        localStorage.removeItem("mac");
        localStorage.removeItem("serial");
        localStorage.removeItem("imei");
        localStorage.setItem("check", "nao");
        showAdditionalContent();
    } else {
        $("#additionalContent").addClass("hidden1");
        localStorage.setItem("mac", "/");
        localStorage.setItem("serial", "/");
        localStorage.setItem("imei", "/");
        localStorage.setItem("check", "sim");
    }
}


// Função para manipular a lógica do select "lacre"
function handleLacre(selectedValue) {
    if (selectedValue === "nao" || "sim") {
        localStorage.setItem("lacre", selectedValue);
    } else {

    }
}

// Função para mostrar o conteúdo adicional baseado na seleção do select "response"
function showAdditionalContent() {
    var selectedOption = localStorage.getItem("selectedOption");
    var resultDiv = document.getElementById("additionalContent");

    // Seu código existente que manipula o conteúdo com base na seleção do equipamento
    if (selectedOption) {
        // Exibe conteúdo baseado na seleção
        if (selectedOption === "coletor") {
            resultDiv.innerHTML = "<div id='alertBox' class='alert-box hidden'>Por favor, preencha os campos MAC e S/N</div><div id='additionalContent' class='hidden'></div><div class='height'><label for='Height'>MAC:<sup>*</sup></label><input id='Height' type='text' autocomplete='off' name='mac' class='input' maxlength='17'/><label for='SerialNumber'>S/N:<sup>*</sup></label><input id='SerialNumber' type='text' autocomplete='off' name='serial' class='input' /><div class='content'><label class='checkBox'><input type='checkbox' id='ch1'><div class='transition'></div></label></div><label for='ch1'>Não possui</label></div>";

        } else if (selectedOption === "leitor") {
            resultDiv.innerHTML = "<div id='alertBox' class='alert-box hidden'>Por favor, preencha o campo S/N</div><div id='additionalContent' class='hidden'></div><div class='height'><label for='SerialNumber'>S/N:<sup>*</sup></label><input id='SerialNumber' type='text' autocomplete='off' name='serial' class='input' /><div class='content'><label class='checkBox'><input type='checkbox' id='ch1'><div class='transition'></div></label></div><label for='ch1'>Não possui</label></div>";

        } else if (selectedOption === "impressora") {
            resultDiv.innerHTML = "<div id='alertBox' class='alert-box hidden'>Por favor, preencha o campo S/N</div><div id='additionalContent' class='hidden'></div><div class='height'><label for='SerialNumber'>S/N:<sup>*</sup></label><input id='SerialNumber' type='text' autocomplete='off' name='serial' class='input' /><div class='content'><label class='checkBox'><input type='checkbox' id='ch1'><div class='transition'></div></label></div><label for='ch1'>Não possui</label></div>";

        } else if (selectedOption === "wifiImpressora") {
            resultDiv.innerHTML = "<div id='alertBox' class='alert-box hidden'>Por favor, preencha os campos MAC e S/N</div><div id='additionalContent' class='hidden'></div><div class='height'><label for='Height'>MAC:<sup>*</sup></label><input id='Height' type='text' autocomplete='off' name='mac' class='input' maxlength='17'/><label for='SerialNumber'>S/N:<sup>*</sup></label><input id='SerialNumber' type='text' autocomplete='off' name='serial' class='input' /><div class='content'><label class='checkBox'><input type='checkbox' id='ch1'><div class='transition'></div></label></div><label for='ch1'>Não possui</label></div>";

        } else if (selectedOption === "celular") {
            resultDiv.innerHTML = "<div id='alertBox' class='alert-box hidden'>Por favor, preencha os campos MAC, S/N e Imei!</div><div id='additionalContent' class='hidden'></div><div class='height'><label for='Height'>MAC:<sup>*</sup></label><input id='Height' type='text' autocomplete='off' name='mac' class='input' maxlength='17'/><label for='SerialNumber'>S/N:<sup>*</sup></label><input id='SerialNumber' type='text' autocomplete='off' name='serial' class='input' /><label for='Imei'>IMEI:<sup>*</sup></label><input id='Imei' type='text' autocomplete='off' name='serial' class='input' maxlength='15'/><div class='content'><label class='checkBox'><input type='checkbox' id='ch1'><div class='transition'></div></label></div><label for='ch1'>Não possui</label></div>";


        }
    }
}

// Continue com o restante da lógica de submit e manipulação de eventos como no seu código original


document.getElementById("goBack").addEventListener("click", function () {
    localStorage.clear();

    window.location.href = "equipamento.html";
});

document.getElementById("submitButton").addEventListener("click", function () {
    let ver_lacre = localStorage.getItem('lacre');
    let ver_serial = localStorage.getItem('serial');
    let ver_check = localStorage.getItem('check');
    const alertBox = document.getElementById("alertBox1");

    var selectedOption = localStorage.getItem("selectedOption");

    if (!ver_lacre || !ver_serial) {
        if (ver_check === 'nao') {
            if (selectedOption) {
                // Exibe conteúdo baseado na seleção
                if (selectedOption === "coletor") {
                    // Obter valores dos inputs
                    const macValue = document.getElementById("Height").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const serialValue = document.getElementById("SerialNumber").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const isChecked = document.getElementById("ch1").checked;
                    const alertBox = document.getElementById("alertBox");

                    // Verificar se o checkbox está selecionado
                    if (isChecked) {
                        // Se o checkbox estiver selecionado, salva valores vazios e não exibe alerta
                        localStorage.setItem("imei", "/");
                        localStorage.setItem("mac", "/"); // Armazena valor vazio para MAC
                        localStorage.setItem("serial", "/"); // Armazena valor vazio para S/N
                        if (ver_lacre === 'sim') {
                            window.location.href = "lacre.html";
                        } else {
                            window.location.href = "obsTecnicas.html";
                        }
                    } else {
                        // Verificar se os campos estão preenchidos
                        if (!macValue || !serialValue) {
                            alertBox.classList.remove("hidden");
                            alertBox.style.display = "block";

                            // Oculta o alerta após 3 segundos
                            setTimeout(() => {
                                alertBox.style.display = "none";
                            }, 3000);
                        } else {
                            // Salvar os valores no localStorage
                            localStorage.setItem("mac", macValue); // Salva em maiúsculas
                            localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                            localStorage.setItem("imei", "/");
                            if (ver_lacre === 'sim') {
                                window.location.href = "lacre.html";
                            } else {
                                window.location.href = "obsTecnicas.html";
                            }
                        }
                    }
                } else if (selectedOption === "leitor") {
                    // Obter valores dos inputs
                    const serialValue = document.getElementById("SerialNumber").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const isChecked = document.getElementById("ch1").checked;
                    const alertBox = document.getElementById("alertBox");

                    // Verificar se o checkbox está selecionado
                    if (isChecked) {
                        // Se o checkbox estiver selecionado, salva valores vazios e não exibe alerta
                        localStorage.setItem("imei", "/");
                        localStorage.setItem("mac", "/"); // Armazena valor vazio para MAC
                        localStorage.setItem("serial", "/"); // Armazena valor vazio para S/N
                        if (ver_lacre === 'sim') {
                            window.location.href = "lacre.html";
                        } else {
                            window.location.href = "obsTecnicas.html";
                        }
                    } else {
                        // Verificar se os campos estão preenchidos
                        if (!serialValue) {
                            alertBox.classList.remove("hidden");
                            alertBox.style.display = "block";

                            // Oculta o alerta após 3 segundos
                            setTimeout(() => {
                                alertBox.style.display = "none";
                            }, 3000);
                        } else {
                            // Salvar os valores no localStorage
                            localStorage.setItem("mac", "/"); // Salva em maiúsculas
                            localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                            localStorage.setItem("imei", "/");
                            if (ver_lacre === 'sim') {
                                window.location.href = "lacre.html";
                            } else {
                                window.location.href = "obsTecnicas.html";
                            }
                        }
                    }
                } else if (selectedOption === "impressora") {
                    // Obter valores dos inputs
                    const serialValue = document.getElementById("SerialNumber").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const isChecked = document.getElementById("ch1").checked;
                    const alertBox = document.getElementById("alertBox");

                    // Verificar se o checkbox está selecionado
                    if (isChecked) {
                        // Se o checkbox estiver selecionado, salva valores vazios e não exibe alerta
                        localStorage.setItem("imei", "/");
                        localStorage.setItem("mac", "/"); // Armazena valor vazio para MAC
                        localStorage.setItem("serial", "/"); // Armazena valor vazio para S/N
                        if (ver_lacre === 'sim') {
                            window.location.href = "lacre.html";
                        } else {
                            window.location.href = "obsTecnicas.html";
                        }
                    } else {
                        // Verificar se os campos estão preenchidos
                        if (!serialValue) {
                            alertBox.classList.remove("hidden");
                            alertBox.style.display = "block";

                            // Oculta o alerta após 3 segundos
                            setTimeout(() => {
                                alertBox.style.display = "none";
                            }, 3000);
                        } else {
                            // Salvar os valores no localStorage
                            localStorage.setItem("mac", "/"); // Salva em maiúsculas
                            localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                            localStorage.setItem("imei", "/");
                            if (ver_lacre === 'sim') {
                                window.location.href = "lacre.html";
                            } else {
                                window.location.href = "obsTecnicas.html";
                            }
                        }
                    }
                } else if (selectedOption === "wifiImpressora") {
                    // Obter valores dos inputs
                    const macValue = document.getElementById("Height").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const serialValue = document.getElementById("SerialNumber").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const isChecked = document.getElementById("ch1").checked;
                    const alertBox = document.getElementById("alertBox");

                    // Verificar se o checkbox está selecionado
                    if (isChecked) {
                        // Se o checkbox estiver selecionado, salva valores vazios e não exibe alerta
                        localStorage.setItem("imei", "/");
                        localStorage.setItem("mac", "/"); // Armazena valor vazio para MAC
                        localStorage.setItem("serial", "/"); // Armazena valor vazio para S/N
                        if (ver_lacre === 'sim') {
                            window.location.href = "lacre.html";
                        } else {
                            window.location.href = "obsTecnicas.html";
                        }
                    } else {
                        // Verificar se os campos estão preenchidos
                        if (!macValue || !serialValue) {
                            alertBox.classList.remove("hidden");
                            alertBox.style.display = "block";

                            // Oculta o alerta após 3 segundos
                            setTimeout(() => {
                                alertBox.style.display = "none";
                            }, 3000);
                        } else {
                            // Salvar os valores no localStorage
                            localStorage.setItem("mac", macValue); // Salva em maiúsculas
                            localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                            localStorage.setItem("imei", "/");
                            if (ver_lacre === 'sim') {
                                window.location.href = "lacre.html";
                            } else {
                                window.location.href = "obsTecnicas.html";
                            }
                        }
                    }
                } else if (selectedOption === "celular") {
                    // Obter valores dos inputs
                    const macValue = document.getElementById("Height").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const serialValue = document.getElementById("SerialNumber").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const imeiValue = document.getElementById("Imei").value.trim().toUpperCase(); // Armazenar em maiúsculas
                    const isChecked = document.getElementById("ch1").checked;
                    const alertBox = document.getElementById("alertBox");

                    // Verificar se o checkbox está selecionado
                    if (isChecked) {
                        // Se o checkbox estiver selecionado, salva valores vazios e não exibe alerta
                        localStorage.setItem("imei", "/");
                        localStorage.setItem("mac", "/"); // Armazena valor vazio para MAC
                        localStorage.setItem("serial", "/"); // Armazena valor vazio para S/N
                        if (ver_lacre === 'sim') {
                            window.location.href = "lacre.html";
                        } else {
                            window.location.href = "obsTecnicas.html";
                        }
                    } else {
                        // Verificar se os campos estão preenchidos
                        if (!macValue || !serialValue || imeiValue) {
                            alertBox.classList.remove("hidden");
                            alertBox.style.display = "block";

                            // Oculta o alerta após 3 segundos
                            setTimeout(() => {
                                alertBox.style.display = "none";
                            }, 3000);
                        } else {
                            // Salvar os valores no localStorage
                            localStorage.setItem("mac", macValue); // Salva em maiúsculas
                            localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                            localStorage.setItem("imei", imeiValue);
                            if (ver_lacre === 'sim') {
                                window.location.href = "lacre.html";
                            } else {
                                window.location.href = "obsTecnicas.html";
                            }
                        }
                    }

                }
            }

        } else {
            alertBox.classList.remove("hidden");
            alertBox.style.display = "block";

            // Oculta o alerta após 3 segundos
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 3000);
        }

    } else {
        if (ver_lacre === 'sim') {
            window.location.href = "lacre.html";
        } else if (ver_check === 'sim') {
            window.location.href = "checklist.html";
        } else {
            window.location.href = "obsTecnicas.html";
        }
    }
});