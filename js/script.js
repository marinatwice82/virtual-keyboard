const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  lang: 'en',

  sft: false,
 
  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "`","1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[","]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",":", "'","enter",
      "done", "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "En","space", "<=","=>"
    ];

    const keyLayoutShift = [
      "`","!", "@", "#", "$", "%", "^", "&", "*", "(", ")","_","+", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[","]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",":", "'","enter",
      "done", "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "En","space", "<=","=>"
    ];

    const keyLayoutRu = [
      "ё","1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=","backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э","enter",
      "done", "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "Ru","space","<=","=>"
    ];

     const keyLayoutRuShift = [
      "ё","!", '"', "№", ";", "%", ":", "?", "*", "(", ")","_","+","backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э","enter",
      "done", "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "Ru","space","<=","=>"
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    let arrKey
    if (this.lang=='en' && this.sft==false){
      arrKey=keyLayout;  
    }
      if (this.lang=='en' && this.sft==true){
      arrKey=keyLayoutShift;  
    }
    if(this.lang=='ru' && this.sft==false) {
      arrKey=keyLayoutRu; 
    }
    if(this.lang=='ru' && this.sft==true) {
      arrKey=keyLayoutRuShift; 
    }
    
    
    arrKey.forEach(key => {
      const keyElement = document.createElement("button");
      let insertLineBreak;

      if (this.lang=='en'){
        insertLineBreak = ["voice","backspace", "]", "enter", "?"].indexOf(key) !== -1;
      }
      else {
        insertLineBreak = ["voice","backspace", "ъ", "enter", "."].indexOf(key) !== -1;
      }
      
      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "<=":
          keyElement.innerHTML = createIconHTML("&larr;");
          keyElement.addEventListener("click", () => {
               let txt = document.querySelector(".use-keyboard-input");
               let end = txt.selectionEnd;
               txt.selectionEnd = end - 1;
               txt.focus();
          });
          break; 

        case "=>":
          keyElement.innerHTML = createIconHTML("&rarr;");
          keyElement.addEventListener("click", () => {
            let txt = document.querySelector(".use-keyboard-input");
            let end = txt.selectionEnd;
            txt.selectionStart = end + 1;
            txt.focus();
          });
          break;  

        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
          });
          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });
          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });
          break;

        case "space":
          keyElement.classList.toggle("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });
          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });
        break;

        case "En":
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.lang='ru'; 
            
            document.querySelector(".keyboard").remove();
            this.init();
            this.open();
            document.querySelector(".use-keyboard-input").focus();
            document.querySelector(".use-keyboard-input").selectionEnd;
          });
          break;

        case "Ru":
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.lang='en'; 
            
            document.querySelector(".keyboard").remove();
            this.init();
            this.open();
            document.querySelector(".use-keyboard-input").focus();
            document.querySelector(".use-keyboard-input").selectionEnd;
         });
          break;

        case "Shift":
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.sft=!this.sft;

            document.querySelector(".keyboard").remove();
            this.init();
            this.open();
            this._toggleCapsLock();
            document.querySelector(".use-keyboard-input").focus();
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this._triggerEvent("oninput");
          });
          document.addEventListener('keydown', function(event) {
            if (event.code==('Key'+key.toUpperCase()) ){
                keyElement.classList.add("key--pressed");
            }
          });

          document.addEventListener('keyup', function(event) {
            if (event.code==('Key'+key.toUpperCase()) ){
                keyElement.classList.remove("key--pressed");
            }
          });
          break;
      }

    fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
}); 


