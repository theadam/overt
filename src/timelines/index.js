const css = `.timeline:last-child{border-bottom:0;}.timeline{width:100%;border-bottom:1px solid gray;position:relative;overflow:hidden;height:100px}.timeline .name{position:absolute;top:0;left:0;color:gray;font-family:sans-serif;padding:2px 5px;font-weight:400;font-size:12px;border-bottom:1px solid gray;border-right:1px solid gray}.timeline .line{position:absolute;background-color:#000;top:50%;left:0;right:0;height:2px}.timeline .ball-wrapper{height:100%;width:100%;position:absolute}.timeline .ball-wrapper .ball{background-color:#ff6946;position:absolute;transform:translateY(-50%);top:50%;width:50px;height:50px;border-radius:100px;border:2px solid #000;text-align:center;line-height:50px;font-weight:700;font-family:sans-serif}`;
const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}
head.appendChild(style);

const { Component } = React;

export class Timelines extends Component {
  componentWillMount() {
    const { streams } = this.props;
    const streamArray = Object.keys(streams).map(key => (
      {name: key, stream: streams[key] }
    ));
    this.setState({ streams: streamArray });
    this._lastUpdate = 0;
    this.scheduleUpdate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._id);
  }

  scheduleUpdate = () => {
    this._id = requestAnimationFrame(this.rerender);
  }

  rerender = (t) => {
    if (t - this._lastUpdate < 16) return this.scheduleUpdate();
    this._lastUpdate = t;
    this.forceUpdate();
    this.scheduleUpdate();
  }

  render() {
    const { streams } = this.state;
    return (
      <div>
        {streams.map(({name, stream}) =>
          <Timeline key={name} name={name} stream={stream} time={this._lastUpdate} />
          )}
        </div>
    );
  }
}

class Timeline extends Component {
  handleStream = value => {
    const event = { key: this._id++, value, offset: Math.random(), time: performance.now() };
    this._events = [
      event,
      ...this._events.slice(0, 15),
    ];
  }

  componentWillMount() {
    this._id = 0;
    this._events = [];
    this._unsubscribe = this.props.stream(this.handleStream);
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  x(time) {
    return 100 - ((this.props.time - time) / 50);
  }

  y(x, offset) {
    return 2 * Math.sin(offset * x/4);
  }

  transform(time, offset) {
    const x = this.x(time);
    const y = this.y(x, offset);
    return `translate(${x}%, ${y}%)`;
  }

  render() {
    return (
      <div className="timeline">
        {this.props.name !== undefined &&
          <div className="name">
            {this.props.name}
          </div>
          }
          <div className="line" />
          {this._events.map(({key, value, time, offset}) =>
            <div key={key} className="ball-wrapper" style={{ transform: this.transform(time, offset) }}>
              <div className="ball">
                {value}
              </div>
            </div>
            )}
          </div>
    );
  }
}
