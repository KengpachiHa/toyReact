import { createElement, Component, render } from './toy-react'

class Mycomponent extends Component{
  render() {
    return <div>
      <h1>my component</h1>
      {this.children}
    </div>
  }
}




render( 
  <Mycomponent id="gg" class="dd">
    <div>abc</div>
    <div></div>
    <div></div>
  </Mycomponent>, document.body)
