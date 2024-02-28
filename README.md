# 概要
HTMLのtextarea内に入力された文字に対してスタイルをつけるために作ったものです。  
様々な環境できちんと動作するかは全然検証されていません。iPhoneだとスクロールの際にずれるという説があります。また元となるtextareaに適用されているスタイル次第では文字がずれるかもしれません。  
実際に文字を変換してスタイルをつける部分は実装されていないので自分で作る必要がありあます。

# 使い方
以下を満たす何かを引数として与えます。  
```
interface MyHighlighter{
    tagging(text:string): string
    textarea:HTMLTextAreaElement
    observe_mode:string
}
```
### tagging
textareaに入力された文字列の必要な部分にspanタグなどを使ってスタイルをつけていく関数を指定してください。  
文字がHTMLとして解釈されるのを防ぐためこの関数に渡される時点で、< を \&lt; に、> を \&gt; に変換しているのでご注意ください。

### textarea
対象となるtextareaを指定してください。

### observe_mode
"strict"か"normal"を指定してください。  
normal（あるいは指定なし）ではinput Event をリッスンしますが、strictでは一定時間毎に入力されたテキストの変化を監視します。  
jsを使って外部から直接テキストを入力した場合、inputのなどのイベントでは検出できないそうなので、そのような使い方が想定されるならstrictを指定してください。

```
function sampleTagging(text){
    return text.replace(/&lt;.+?&gt;/g,'<span style="color:#bcbaba;">$&</span>');
}
const myHLTer = {
    tagging: sampleTagging,
    textarea:document.getElementById("my-textarea"),
    observe_mode:"strict"
  };
 new TextAreahigHlighter(myHLTer);
```
