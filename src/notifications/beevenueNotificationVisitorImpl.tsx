import { Link } from "react-router-dom";

import {
  BeevenueNotificationVisitor,
  CompositeContent,
  TextContent,
  LinkContent,
} from "./impl";

export class BeevenueNotificationVisitorImpl
  implements BeevenueNotificationVisitor
{
  readonly elements: (string | JSX.Element)[] = [];
  visitComposite(c: CompositeContent): void {
    c.contents.forEach((cc) => cc.visit(this));
  }
  visitText(c: TextContent): void {
    this.elements.push(c.text);
  }
  visitLink(c: LinkContent): void {
    this.elements.push(<Link to={c.location}>{c.text}</Link>);
  }
  asElement(): JSX.Element {
    const elementCount = this.elements.length;
    // This doesn't deal with two non-text elements directly after each other correctly.
    // This would require doing something more complicated than a map(), but won't become
    // a problem any time soon.
    return (
      <>
        {this.elements.map((el, idx) => {
          if (typeof el !== "string") {
            return {
              ...el,
              key: idx,
            };
          }
          let result = "";
          if (idx !== 0) {
            result += " ";
          }
          result += el;
          if (idx !== elementCount - 1) {
            result += " ";
          }
          return result;
        })}
      </>
    );
  }
}
