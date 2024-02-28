interface MyHighlighter{
    tagging(text:string): string
    textarea:HTMLTextAreaElement
    observe_mode:string
  }
class TextAreahigHlighter {
    container:HTMLDivElement;
    dammy:HTMLDivElement;
    myHLTer:MyHighlighter
    pre_value :string
    interval_id:number
    dom_state:boolean
    constructor(myHLTer:MyHighlighter) {
        this.myHLTer = myHLTer;
        this.myHLTer.textarea.setAttribute("style","scrollbar-width:none;-ms-overflow-style: none;"+this.myHLTer.textarea.style.cssText);
        this.dom_state =false
        this.myHLTer.textarea.style.display = "block";
        this.myHLTer.textarea.style.width = "100%";
        this.myHLTer.textarea.style.maxWidth = "100%";
        this.interval_id = 0;
        this.container = document.createElement("div");
        this.container.setAttribute("style",this.myHLTer.textarea.style.cssText+"scrollbar-width:none;-ms-overflow-style: none;padding:0;");
        this.container.style.position = "relative";
        //this.container.style.border = "none";
        this.container.style.backgroundColor = "transparent";
        this.container.style.boxSizing = "border-box";
        this.myHLTer.textarea.before(this.container);
        this.myHLTer.textarea.style.margin = "0";
        this.myHLTer.textarea.style.border = "0";
        this.container.appendChild(this.myHLTer.textarea);
        this.dammy = document.createElement("div");
        this.dammy.setAttribute("style","scrollbar-width:none;-ms-overflow-style: none;margin:0;position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block;white-space:pre-wrap;border:none;");
        this.pre_value = this.myHLTer.textarea.value;
        this.dammy.style.border = this.myHLTer.textarea.style.border;
        this.container.appendChild(this.dammy);
        this.dammy.style.borderColor = "transparent";
        if (this.myHLTer.observe_mode == "strict" ){
            const observer = new IntersectionObserver(entries =>{
                entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.interval_id = setInterval(this.checkValue.bind(this), 300);
                }else{
                    clearInterval(this.interval_id );
                }
              });
            });
            observer.observe(this.myHLTer.textarea);
        }else{
            this.myHLTer.textarea.addEventListener('input', this.tagging.bind(this));
        }
        this.myHLTer.textarea.addEventListener('scroll', this.scrollAdjuster.bind(this));
        new ResizeObserver(this.resizeAdjuster.bind(this)).observe(this.myHLTer.textarea);
    }
    initialSetting(){
        const texarea_styles = window.getComputedStyle(this.myHLTer.textarea);
        this.dammy.style.fontSize = texarea_styles.getPropertyValue("font-size");
        this.dammy.style.padding = texarea_styles.getPropertyValue("padding");
        this.dammy.style.fontFamily = texarea_styles.getPropertyValue("font-family");
        this.dammy.style.outline = texarea_styles.getPropertyValue("outline");
    }
    resizeAdjuster(){
        const texarea_styles = window.getComputedStyle(this.myHLTer.textarea);
        this.dammy.style.fontSize = texarea_styles.getPropertyValue("font-size");
        this.dammy.style.padding = texarea_styles.getPropertyValue("padding");
        this.dammy.style.width = texarea_styles.getPropertyValue("width");
        this.dammy.style.height = texarea_styles.getPropertyValue("height");
    }
    scrollAdjuster(){
        this.dammy.style.height = String(Number(this.myHLTer.textarea.style.height)+this.myHLTer.textarea.scrollTop)+"px";
        this.dammy.style.top = String(-this.myHLTer.textarea.scrollTop)+"px";
    }
    checkValue(){
        if (this.pre_value != this.myHLTer.textarea.value){
            this.tagging();
            this.pre_value = this.myHLTer.textarea.value;
        }
    }
    tagging(){
        if (!this.dom_state){
            this.dom_state = true;
            this.initialSetting();
        }
        this.dammy.innerHTML= this.myHLTer.tagging(this.escapeTag(this.myHLTer.textarea.value));
        return
    }
    escapeTag(text:string) {
        return text.split("<").join("&lt;").split(">").join("&gt;")
    }
  }