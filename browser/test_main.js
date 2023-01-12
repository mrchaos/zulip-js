// // import * as z from "./lib/"
// // export function write_msg() {
// // }

const zulip = require('../lib');

class CZulip {
  constructor(email, apiKey, uri) {
    this.z = zulip({username: email, apiKey, realm: uri});
    this.msgQ = null;
  }

  async getZulip() {
    return this.z;
  }

  async getStreams() {
    const z = await this.z;
    // The zulip object now initialized with config
    return z.streams.subscriptions.retrieve();    
  }

  // eventHandler(event)
  async callOnEachMessage(eventHandler)  {
    const z = await this.z;
    return z.callOnEachEvent(eventHandler, ['message']);
  }

  // message rendering
  async messageRender(msg) {
    const z = await this.z;
    return z.messages.render(msg);
  }

  // message send
  async sendMessage(stream,subject,content) {
    const z = await this.z;    
    return  z.messages.send({
      to: stream,
      type: 'stream',
      subject,
      content,
    });

    // return  = await z.messages.send({
    //   to: stream,
    //   type: 'stream',
    //   subject,
    //   content,
    // });

    // eslint-disable-next-line no-console
    // console.log(res);

    // return res;
  }
}



// eslint-disable-next-line no-unused-vars
function localTest() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  // eslint-disable-next-line no-unused-vars
  const cz = new CZulip("zulip@cherrycorp.io","YFeqVpDmkco4tXRtdnJezpObp3XZ9fJT","https://ai.e4net.net")
  
  // //------------------------
  // // realtime message
  // //------------------------
  // function handleEvent(event) {
  //   console.log(event);
  // }
  // cz.callOnEachMessage(handleEvent);

  // //------------------------
  // // get stream
  // //------------------------
  // cz.getStreams().then((data) =>{
  //   console.log(data);
  // });

  // //------------------------
  // // get stream with zulip
  // //------------------------
  // cz.getZulip().then((zulip) => {
  //   zulip.streams.subscriptions.retrieve().then((data) =>{
  //       console.log(data)});
  // });

  // //------------------------
  // // message render
  // //------------------------
  // const msg = "" +
  //   "Inline: $$O(n^2)$$" +
  //    "Displayed:" +
  //   "``` math" +
  //   "\\int_a^b f(t)\\, dt = F(b) - F(a)" +
  //   "```" ;
  // cz.messageRender(msg).then((m)=> {
  //   console.log(m);
  // });

  //------------------------
  // message render
  //------------------------
  // cz.sendMessage("단체1-공개","테스트토픽","**데스트 메시지 입니다**")
  //   .then((res)=>{
  //     console.log(res);
  //   });

}

// localTest();

module.exports = {
  // eslint-disable-next-line object-shorthand
  CZulip: CZulip,
};