var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var xlsx = require('node-xlsx').default;
var fs = require('fs');
var dataList = [[
	'index',
	'title',
	'pronunciation',
	'paraphrase',
	'from'
]];
var getData = function(page) {
	http.get(`http://tools.2345.com/chengyu/cy/${page}.htm`, function(sres) {
	  let chunks = [];
	  sres.on('data', function(chunk) {
	    chunks.push(chunk);
	  });
	  sres.on('end', function() {
	    let html = iconv.decode(Buffer.concat(chunks), 'gb2312');
			let $ = cheerio.load(html, {decodeEntities: false});
				dataList.push([
					page,
					$('.cate_title_de').text(),
					$('.py').text(),
					$('body > div.main > div.ancient.mt10.clearfix > div.mod_at_cont > div.ancient_detail > p:nth-child(2) > span').text(),
					$('div.ancient_detail > p:nth-child(3) > span').text(),
				])
				console.log(page)
				if(page<30780) {
						getData(++page);
				}else {
					console.log('完成');
					var buffer = xlsx.build([{name: "mySheetName", data: dataList}]); 
					fs.writeFileSync('test.xlsx', buffer);
				}
	  });
	});
}
getData(1);
