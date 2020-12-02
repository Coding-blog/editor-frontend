import { RendererLike } from 'render-jsx';
import { Source } from 'callbag-common';
import { StateLike } from 'callbag-state';
import { OverlayWidget } from '../overlay/attached';
import { DatePicker } from '../date-input/widget';
import { TimePicker } from '../time-input/widget';
import { classes } from './style';


export interface DateTimeWidgetProps {
  element: RefLike<HTMLElement>;
  _state: StateLike<Date>
  focused: Source<boolean>;
}


export function DateTimeWidget(props: DateTimeWidgetProps, renderer: RendererLike<Node>) {
  return <OverlayWidget element={props.element} show={props.focused}
    attachment={rect => ({ top: rect.bottom - 5, left: rect.left + 6})}>
    <div class={classes().dateTimeWidget}>
      <DatePicker _state={props._state}/>
      <div class={classes().divider}/>
      <TimePicker _state={props._state}/>
    </div>
  </OverlayWidget>;
}
