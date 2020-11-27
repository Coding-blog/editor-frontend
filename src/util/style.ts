import jss, { Styles, Classes } from 'jss';


export function style<Name extends string | number | symbol = string>(styles: Partial<Styles<Name>>) {
  let classes: Classes<Name> | undefined = undefined;

  return () => {
    if (!classes) {
      classes = jss.createStyleSheet(styles).attach().classes;
    }

    return classes;
  };
}
