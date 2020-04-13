import { getTrimmedSvg } from '../SvgTrimmer'

/*export const saveAsSvg = () => {
  const SVGDomElement = document.getElementById("TEMPO")

  const serializedSVG = new XMLSerializer().serializeToString(SVGDomElement)

  const base64Data = window.btoa(serializedSVG)

  const dataURL = `data:image/svg+xml;base64,${base64Data}`

  const dl = document.createElement("a");
  document.body.appendChild(dl);
  dl.setAttribute("href", dataURL);
  dl.setAttribute("download", "test.svg");
  dl.click();
  document.body.removeChild(dl)
}*/

var ContainerElements = ["svg", "g", "foreignObject"];
var RelevantStyles: any = {
  "rect": ["fill", "stroke", "stroke-width"],
  "path": ["fill", "stroke", "stroke-width"],
  "circle": ["fill", "stroke", "stroke-width"],
  "line": ["stroke", "stroke-width"],
  "text": ["fill", "font-size", "text-anchor"],
  "polygon": ["stroke", "fill"],
  "DIV": ["font-size", "font-family", "min-width", "position", "left", "top", "transform", "justify-content", "align-items"]
};

function read_Element(ParentNode: any, OrigData: any) {
  var Children = ParentNode.childNodes;
  var OrigChildDat = OrigData.childNodes;

  for (var cd = 0; cd < Children.length; cd++) {
    var Child = Children[cd];

    var TagName = Child.tagName;
    if (ContainerElements.indexOf(TagName) != -1) {
      read_Element(Child, OrigChildDat[cd])
    } else if (TagName in RelevantStyles) {
      var StyleDef = window.getComputedStyle(OrigChildDat[cd]);

      var StyleString = "";
      for (var st = 0; st < RelevantStyles[TagName].length; st++) {
        StyleString += RelevantStyles[TagName][st] + ":" + StyleDef.getPropertyValue(RelevantStyles[TagName][st]) + "; ";
      }

      if (TagName === "DIV") {
        StyleString += "display: flex;"
      }

      Child.setAttribute("style", StyleString);
    }
  }
}

export const saveAsSvg = (name: string) => {
  const SVGDomElement = getTrimmedSvg()
  var oDOM = SVGDomElement.cloneNode(true)
  read_Element(oDOM, SVGDomElement)

  var data = new XMLSerializer().serializeToString(oDOM);
  var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  var dataURL = URL.createObjectURL(svg);

  const dl = document.createElement("a");
  document.body.appendChild(dl);
  dl.setAttribute("href", dataURL);
  dl.setAttribute("download", name + ".svg");
  dl.click();
  document.body.removeChild(dl)

  SVGDomElement.parentNode.removeChild(SVGDomElement)
}
