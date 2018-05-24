// var nodefs = require('fs');
//
// process.stdin.setEncoding('utf8');
//
// process.stdin.on('readable', function() {
//   var chunk = process.stdin.read();
//   if (chunk !== null) {
//     onmessage({data: chunk});
//   }
// });
//
// process.stdin.on('end', function() {
//   process.exit();
// });

//
// var str = ''
// ...
// nodefs.writeSync(1, str + '\n');


process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  var input = process.stdin.read();
  if(input !== null) {
    process.stdout.write(`stdout: ${input}\n`);
    var command = input.trim();

    console.log(input.length);  //this one is always 1 longer
    console.log(command.length);

    if(command === 'quit') {
      process.exit(0);
    }
  }
});
