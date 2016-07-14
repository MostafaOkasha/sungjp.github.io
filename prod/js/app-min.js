!function(){"use strict";var e=!1;if("undefined"!=typeof process&&!process.browser){e=!0;var t=require("request".trim())}var s=!1,n=!1;try{var o=new XMLHttpRequest;"undefined"!=typeof o.withCredentials?s=!0:"XDomainRequest"in window&&(s=!0,n=!0)}catch(e){}var i=Array.prototype.indexOf,r=function(e,t){var s=0,n=e.length;if(i&&e.indexOf===i)return e.indexOf(t);for(;s<n;s++)if(e[s]===t)return s;return-1},a=function(t){return this&&this instanceof a?("string"==typeof t&&(t={key:t}),this.callback=t.callback,this.wanted=t.wanted||[],this.key=t.key,this.simpleSheet=!!t.simpleSheet,this.parseNumbers=!!t.parseNumbers,this.wait=!!t.wait,this.reverse=!!t.reverse,this.postProcess=t.postProcess,this.debug=!!t.debug,this.query=t.query||"",this.orderby=t.orderby,this.endpoint=t.endpoint||"https://spreadsheets.google.com",this.singleton=!!t.singleton,this.simple_url=!!t.simple_url,this.callbackContext=t.callbackContext,this.prettyColumnNames="undefined"==typeof t.prettyColumnNames?!t.proxy:t.prettyColumnNames,"undefined"!=typeof t.proxy&&(this.endpoint=t.proxy.replace(/\/$/,""),this.simple_url=!0,this.singleton=!0,s=!1),this.parameterize=t.parameterize||!1,this.singleton&&("undefined"!=typeof a.singleton&&this.log("WARNING! Tabletop singleton already defined"),a.singleton=this),/key=/.test(this.key)&&(this.log("You passed an old Google Docs url as the key! Attempting to parse."),this.key=this.key.match("key=(.*?)(&|#|$)")[1]),/pubhtml/.test(this.key)&&(this.log("You passed a new Google Spreadsheets url as the key! Attempting to parse."),this.key=this.key.match("d\\/(.*?)\\/pubhtml")[1]),this.key?(this.log("Initializing with key "+this.key),this.models={},this.model_names=[],this.base_json_path="/feeds/worksheets/"+this.key+"/public/basic?alt=",e||s?this.base_json_path+="json":this.base_json_path+="json-in-script",void(this.wait||this.fetch())):void this.log("You need to pass Tabletop a key!")):new a(t)};a.callbacks={},a.init=function(e){return new a(e)},a.sheets=function(){this.log("Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)")},a.prototype={fetch:function(e){"undefined"!=typeof e&&(this.callback=e),this.requestData(this.base_json_path,this.loadSheets)},requestData:function(t,o){if(e)this.serverSideFetch(t,o);else{var i=this.endpoint.split("//").shift()||"http";!s||n&&i!==location.protocol?this.injectScript(t,o):this.xhrFetch(t,o)}},xhrFetch:function(e,t){var s=n?new XDomainRequest:new XMLHttpRequest;s.open("GET",this.endpoint+e);var o=this;s.onload=function(){var e;try{e=JSON.parse(s.responseText)}catch(e){console.error(e)}t.call(o,e)},s.send()},injectScript:function(e,t){var s,n=document.createElement("script");if(this.singleton)t===this.loadSheets?s="Tabletop.singleton.loadSheets":t===this.loadSheet&&(s="Tabletop.singleton.loadSheet");else{var o=this;s="tt"+ +new Date+Math.floor(1e5*Math.random()),a.callbacks[s]=function(){var e=Array.prototype.slice.call(arguments,0);t.apply(o,e),n.parentNode.removeChild(n),delete a.callbacks[s]},s="Tabletop.callbacks."+s}var i=e+"&callback="+s;this.simple_url?e.indexOf("/list/")!==-1?n.src=this.endpoint+"/"+this.key+"-"+e.split("/")[4]:n.src=this.endpoint+"/"+this.key:n.src=this.endpoint+i,this.parameterize&&(n.src=this.parameterize+encodeURIComponent(n.src)),document.getElementsByTagName("script")[0].parentNode.appendChild(n)},serverSideFetch:function(e,s){var n=this;t({url:this.endpoint+e,json:!0},function(e,t,o){return e?console.error(e):void s.call(n,o)})},isWanted:function(e){return 0===this.wanted.length||r(this.wanted,e)!==-1},data:function(){if(0!==this.model_names.length)return this.simpleSheet?(this.model_names.length>1&&this.debug&&this.log("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong."),this.models[this.model_names[0]].all()):this.models},addWanted:function(e){r(this.wanted,e)===-1&&this.wanted.push(e)},loadSheets:function(t){var n,o,i=[];for(this.googleSheetName=t.feed.title.$t,this.foundSheetNames=[],n=0,o=t.feed.entry.length;n<o;n++)if(this.foundSheetNames.push(t.feed.entry[n].title.$t),this.isWanted(t.feed.entry[n].content.$t)){var r=t.feed.entry[n].link.length-1,a=t.feed.entry[n].link[r].href.split("/").pop(),l="/feeds/list/"+this.key+"/"+a+"/public/values?alt=";l+=e||s?"json":"json-in-script",this.query&&(l+="&sq="+this.query),this.orderby&&(l+="&orderby=column:"+this.orderby.toLowerCase()),this.reverse&&(l+="&reverse=true"),i.push(l)}for(this.sheetsToLoad=i.length,n=0,o=i.length;n<o;n++)this.requestData(i[n],this.loadSheet)},sheets:function(e){return"undefined"==typeof e?this.models:"undefined"==typeof this.models[e]?void 0:this.models[e]},sheetReady:function(e){this.models[e.name]=e,r(this.model_names,e.name)===-1&&this.model_names.push(e.name),this.sheetsToLoad--,0===this.sheetsToLoad&&this.doCallback()},loadSheet:function(e){var t=this;new a.Model({data:e,parseNumbers:this.parseNumbers,postProcess:this.postProcess,tabletop:this,prettyColumnNames:this.prettyColumnNames,onReady:function(){t.sheetReady(this)}})},doCallback:function(){0===this.sheetsToLoad&&this.callback.apply(this.callbackContext||this,[this.data(),this])},log:function(e){this.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.log&&Function.prototype.apply.apply(console.log,[console,arguments])}},a.Model=function(e){var t,s,n,o;if(this.column_names=[],this.name=e.data.feed.title.$t,this.tabletop=e.tabletop,this.elements=[],this.onReady=e.onReady,this.raw=e.data,"undefined"==typeof e.data.feed.entry)return e.tabletop.log("Missing data for "+this.name+", make sure you didn't forget column headers"),this.original_columns=[],this.elements=[],void this.onReady.call(this);for(var i in e.data.feed.entry[0])/^gsx/.test(i)&&this.column_names.push(i.replace("gsx$",""));for(this.original_columns=this.column_names,t=0,n=e.data.feed.entry.length;t<n;t++){var r=e.data.feed.entry[t],a={};for(s=0,o=this.column_names.length;s<o;s++){var l=r["gsx$"+this.column_names[s]];"undefined"!=typeof l?e.parseNumbers&&""!==l.$t&&!isNaN(l.$t)?a[this.column_names[s]]=+l.$t:a[this.column_names[s]]=l.$t:a[this.column_names[s]]=""}void 0===a.rowNumber&&(a.rowNumber=t+1),e.postProcess&&e.postProcess(a),this.elements.push(a)}e.prettyColumnNames?this.fetchPrettyColumns():this.onReady.call(this)},a.Model.prototype={all:function(){return this.elements},fetchPrettyColumns:function(){if(!this.raw.feed.link[3])return this.ready();var e=this.raw.feed.link[3].href.replace("/feeds/list/","/feeds/cells/").replace("https://spreadsheets.google.com",""),t=this;this.tabletop.requestData(e,function(e){t.loadPrettyColumns(e)})},ready:function(){this.onReady.call(this)},loadPrettyColumns:function(e){for(var t={},s=this.column_names,n=0,o=s.length;n<o;n++)"undefined"!=typeof e.feed.entry[n].content.$t?t[s[n]]=e.feed.entry[n].content.$t:t[s[n]]=s[n];this.pretty_columns=t,this.prettifyElements(),this.ready()},prettifyElements:function(){var e,t,s,n,o=[],i=[];for(t=0,n=this.column_names.length;t<n;t++)i.push(this.pretty_columns[this.column_names[t]]);for(e=0,s=this.elements.length;e<s;e++){var r={};for(t=0,n=this.column_names.length;t<n;t++){var a=this.pretty_columns[this.column_names[t]];r[a]=this.elements[e][this.column_names[t]]}o.push(r)}this.elements=o,this.column_names=i},toArray:function(){var e,t,s,n,o=[];for(e=0,s=this.elements.length;e<s;e++){var i=[];for(t=0,n=this.column_names.length;t<n;t++)i.push(this.elements[e][this.column_names[t]]);o.push(i)}return o}},"undefined"!=typeof module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):window.Tabletop=a}(),function(){"use strict";angular.module("times.tabletop",[]).provider("Tabletop",function(){var e,t={callback:function(t,s){e.resolve([t,s])}};this.setTabletopOptions=function(e){t=angular.extend(t,e)},this.$get=["$q","$window",function(s,n){return e=s.defer(),n.Tabletop.init(t),e.promise}]})}(),function(){"use strict";angular.module("Site",["ngAnimate","times.tabletop","ngSanitize","luegg.directives"]).config(["TabletopProvider",function(e){e.setTabletopOptions({key:"1uvHeB66RrTJ87hmna5SnSvBeiuCQ3PE84OLcTL6iwdI",simple_url:!0})}]).factory("DialoguePortfolioParser",[function(){var e={parse:function(e){var t={};return t.dialogue=[],_.each(e[0].Dialogue.elements,function(e){t.dialogue.push({possibleInputs:e.possibleInputs.split(","),response:e.response})}),t.portfolio=e[0].Portfolio.elements,t}};return e}]).factory("DialogueCache",[function(){return{dialogue:[{response:"Hello &#128522;",possibleInputs:["hello","greetings","hi","hey","wassup","whats up","ayy","hola","ni hao","hoy","eyy"]},{response:"I was born in Chattanooga, TN and raised in Huntsville, AL.",possibleInputs:["where are you from","you from","born"]},{response:"Yup",possibleInputs:["okay","oh"]},{response:"Why, thank-you &#128522;",possibleInputs:["you're","youre","you are"]},{response:"My favorite movie is <i>The Imitation Game</i>.",possibleInputs:["movie"]},{response:"My favorite novel is <i>The Brothers Karamazov</i> by Fyodor Dostoevsky.",possibleInputs:["book"]},{response:"Nikola Tesla",possibleInputs:["person in history","historical person","favorite person"]},{response:"Bay Area",possibleInputs:["place"]},{response:"Tonkatsu",possibleInputs:["food"]},{response:"Dog",possibleInputs:["animal"]},{response:"Teal",possibleInputs:["color","colour"]},{response:"I&#39;d like to someday work full-time at either a start-up or a large company as a software engineer.",possibleInputs:["want to do","plan","future","would you like to do","what do you want"]},{response:"I like jazz, hip-hop, and classical music.",possibleInputs:["music","listen","genre","what do you like","what kind of stuff do you like"]},{response:"I play the piano and violin.",possibleInputs:["instruments","play"]},{response:"I&#39;m currently majoring in computer science and music at Amherst College.",possibleInputs:["study","major","subject","degree","bachelor","college","school"]},{response:"20",possibleInputs:[" age","old"]},{response:"Grant Park",possibleInputs:["name"]},{response:"I currently live in Amherst, MA.",possibleInputs:["where","live"]},{response:"Sorry to hear that. &#128533;",possibleInputs:["not","bad","terrible"]},{response:"Sweet. &#128522;",possibleInputs:["good","fine","well","awesome","fantastic","amazing","same","me too","as well"]},{response:"I&#39;m doing pretty well, thanks! How about you?",possibleInputs:["how are you","how are you doing","how are you feeling"]},{response:"I think everyday is a nice day...",possibleInputs:["weather","cold","climate","temp","hot","warm","chill"]},{response:"&#128522;",possibleInputs:["lol","rofl","wow","woah","dang","huh","eh","hm","jeez","geez","cool"]},{response:'Tap this phone&#39;s home button or enter <span style="color:lemonchiffon">&#39;switch&#39;</span> to transition to my projects.',possibleInputs:["project","example","done"]},{response:'You can email me at <a href="mailto:gpark18@amherst.edu">gpark18@amherst.edu</a>. &#128522;',possibleInputs:["contact","email","reach"]},{response:"I&#39;m a sophomore at Amherst College and I freelance iOS. I&#39;m also a full-stack dev working with MEAN, Python, and Swift/Obj-C.",possibleInputs:["about","you do","job","occupation","now","language","work","who are you","who"]},{response:'I&#39;m an <a href="https://soundcloud.com/grant-park">indie artist</a>, rowing athlete, and <a href="https://www.behance.net/grantpark">designer</a>. Check out my <a href="https://medium.com/@grantxs">blog</a> &#128513;',possibleInputs:["do you like to do","hob","design","extracurricular","outside","fun"]},{response:'Here is my <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["linkedin"]},{response:'Here is my <a href="https://github.com/sungjp">Github</a>.',possibleInputs:["git"]},{response:'Here is my <a href="parkgrantresume.pdf" target="_blank">resume</a>.',possibleInputs:["resume"]},{response:'Here is my <a href="parkgrantresume.pdf">resume</a>, <a href="https://github.com/sungjp">Github</a>, and <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["links"]},{response:"Hello &#128522;",possibleInputs:["yo","oi"]},{response:'Try including: <span style="color:lemonchiffon"> <br/> &#39;links&#39; <br/> &#39;projects&#39; <br/> &#39;hobbies&#39; <br/> &#39;contact&#39; <br/> &#39;about&#39; </span> ',possibleInputs:["?","help"]}],portfolio:[{name:"Hurdlr",icon:"hurdlr",link:"https://hurdlr.com/"},{name:"Dangle",icon:"dangle",link:"https://itunes.apple.com/us/app/dangle-parents-kids-connect/id1082572052?mt=8"},{name:"Hungrie",icon:"hungrie",link:"http://www.hungrie.site/"},{name:"Byte",icon:"byte",link:"http://yhackbyte.herokuapp.com/"},{name:"Amherst EC",icon:"amherstec",link:"http://amherstec.github.io/"},{name:"NoteSMS",icon:"notesms",link:"http://www.granthpark.me/BostonHacks/index.html"},{name:"OutsideHacks",icon:"outsidehacks",link:"http://www.granthpark.me/outside.html"},{name:"CodePen",icon:"codepen",link:"http://codepen.io/sungjp/"},{name:"LinkedIn",icon:"linkedin",link:"https://www.linkedin.com/in/granthpark"},{name:"Github",icon:"github",link:"https://github.com/sungjp"},{name:"Resume",icon:"resume",link:"http://www.granthpark.me/parkgrantresume.pdf"},{name:"Website 1.0",icon:"website1",link:"http://www.grantpark.rocks/"}]}}]).factory("GrantsAge",[function(){var e=new Date,t=e.getMonth()+1,s=e.getFullYear(),n=e.getDay(),o=s-1995;return 12>t?o-=1:2>n&&(o-=1),o.toString()}]).factory("Weather",["$http","$q",function(e,t){var s,n=t.defer(),o=e.get("http://api.wunderground.com/api/c1ea49b3e06dc3b3/geolookup/conditions/q/MA/Amherst.json").then(function(e){var t=e.data,n=t.location.city,o=t.current_observation.temp_f;s="The current temperature in "+n+" is: "+o+"&deg;F &#128513;",50>o&&(s="Brrr! The current temperature in "+n+" is: "+o+"&deg:F &#128559;")},function(e){console.error(e),s="I don't have a clue actually..."}),i=function(){n.resolve(s)};return s?i():o.then(function(){i()}),n.promise}]).controller("Dialogue",["$sce","$element","$timeout","$q","$scope","Tabletop","DialoguePortfolioParser","DialogueCache","Weather","GrantsAge",function(e,t,s,n,o,i,r,a,l,p){var h=io.connect("http://grantbot.herokuapp.com/");h.on("joined",function(e){window.works=e,console.log(e)}),h.emit("new user","lol123");var u=a,c=a.dialogue,d=(a.portfolio,function(e){for(var t=n.defer(),s=0;s<c.length;s++)for(var o=0;o<c[s].possibleInputs.length;o++)if(e.toLowerCase().indexOf(c[s].possibleInputs[o].toLowerCase())!==-1)return t.resolve({response:c[s].response,i:s,j:o}),t.promise;return t.reject("Sorry, I can't respond to that."),t.promise}),m=20;o.pages=[];var g=[];_.each(o.portfolio,function(e){g.length===m&&(o.pages.push(g),g=[]),g.push(e)}),g!==[]&&o.pages.push(g),o.tabs=[{name:"Github",icon:"prod/img/github.jpg",link:"https://github.com/sungjp"},{name:"LinkedIn",icon:"prod/img/linked.jpg",link:"https://www.linkedin.com/in/granthpark"},{name:"Resume",icon:"prod/img/resume.jpg",link:"http://www.granthpark.me/parkgrantresume.pdf"}],o.lock=!1;var f=function(e,t){t||o.lock?o.lock||o.messageQueue.push({sender:t?t:"Grant",message:e}):(o.lock=!0,s(function(){o.messageQueue.push({sender:t?t:"Grant",message:e})},900).then(function(){o.lock=!1}))};o.trustAsHtml=function(t){return e.trustAsHtml(t)},o.dialogue=!0,o.buttonClicked=function(){o.dialogue=!o.dialogue};var y=function(e){function t(t){return e.toLowerCase().indexOf(t)!==-1}return t("project")?s(function(){o.dottedAnimate=!0},500):t("switch")&&o.buttonClicked(),!1};o.currentUser={text:""},o.messageQueue=[],o.send=function(e){!o.lock&&e&&(y(e)||(f(e,"user"),t.find("input").val(""),o.currentUser.text=null,d(e).then(function(e){switch(e.response){case"E.AGE":f(p);break;case"E.WEATHER":l.then(function(e){f(e)});break;default:f(e.response)}},function(e){f(e)})))},i.then(function(e){var t=n.defer();return e?t.resolve(e):t.reject("Could not retrieve data"),t.promise}).then(function(e){u=r.parse(e),c=u.dialogue,o.portfolio=u.portfolio,o.pages=[];var t=[];_.each(o.portfolio,function(e){t.length===m&&(o.pages.push(t),t=[]),t.push(e)}),t!==[]&&o.pages.push(t)},function(e){console.error(e)}),f("Hi, I'm Grant Park. Ask me anything you'd like. For suggestions, try '?'"),s(function(){t.addClass("loaded")},1250),o.pageMove="translateX(0)",o.currentOption=0,o.optionSelected=function(e){o.pageMove="translateX("+e*-309+"px)",o.currentOption=e},o.imageDict={hurdlr:"prod/img/hurdlr.jpeg",dangle:"prod/img/dangle.jpg",hungrie:"prod/img/hungrie.jpg",byte:"prod/img/byte.jpg",notesms:"prod/img/onenote.jpg",outsidehacks:"prod/img/outside.jpg",amherstec:"prod/img/amherst.jpg",codepen:"prod/img/codepen.jpg",linkedin:"prod/img/linked.jpg",github:"prod/img/github.jpg",resume:"prod/img/resume.jpg",website1:"prod/img/web1.jpg",setmine:"prod/img/setmine.jpg",r2r:"prod/img/r2r.jpg",soundcloud:"prod/img/soundcloud.jpg",medium:"prod/img/medium.jpg",behance:"prod/img/behance.jpg",pair:"prod/img/pair.jpg",code:"prod/img/code.jpg"}}])}();