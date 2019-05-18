import app from './app';
// import checkGet from './checkGet.js';
const { PORT = 8080 } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-console



// async function check(){
//     var checkResult = await  checkGet('http://39.107.249.53:8082/api/block/blockList?pageNum=1&showNum=10');
//     console.log(checkResult);
// }


// check();