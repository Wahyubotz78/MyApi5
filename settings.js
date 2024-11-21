const fs = require('fs')

global.creator = 'DluxTzy'// yourname
global.MONGO_DB_URI = 'mongodb+srv://vikodk:ciliwung67@cluster0.yk7km.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
global.ACTIVATION_TOKEN_SECRET = "-@Pqnap+@(/1jAPPnew/@10" //isi apa aja bebas
global.your_email = "sandikurniawan12042004@gmail.com"
global.email_password = "plgeklttdfciejjw"
global.limitCount = 1000
global.YUOR_PORT = 8000
global.listApi = ['zpka_b772f4f8372b4ca6965371399918bb5f_444c635b','zpka_87fcc29824e446618f9f0d45f27653f1_3a6ce29d','zpka_136dab30f03945dd983bb8f5ee18215c_54fe3569','zpka_948d594e4cf2495fa9e9827524ea4732_3f973216']
global.loghandler = {
	noapikey:{
		status: 403,
        message: 'Input parameter apikey',
        creator: `${creator}`,
        result: "error"
    },
    error: {
        status: 503,
        message: 'Service Unavaible, Sedang dalam perbaikan',
        creator: `${creator}`
    },
    apikey: {
    	status: 403,
    	message: 'Forbiden, Invalid apikey',
    	creator: `${creator}`
    },
    noturl: {
    	status: 403,
    	message: 'Forbiden, Invlid url, masukkan parameter url',
    	creator: `${creator}`,
    }
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update'${__filename}'`)
	delete require.cache[file]
	require(file)
})
