var mysql      = require('mysql');

function GetConnection(usecusformat)
{
	var db = mysql.createConnection({
		host     : "localhost",
		user     : "root",
		password : "",
		database : "test"
	})
	if(usecusformat)
	{
		db.config.queryFormat = function (query, values) {
			if (!values) return query;
			return query.replace(/\:(\w+)/g, function (txt, key) {
				if (values.hasOwnProperty(key)) {
					return this.escape(values[key]);
				}
				else{
					return this.escape(null);
				}
			}.bind(this));
		};
	}
	return db;
}

/*
 * 集合`users`的文档`User`构造函数
 * @param {Object} user: 包含用户信息的一个对象
 */
function User(user) {
	this.Account = user.Account;
	this.Password = user.Password;
	this.UserName  = user.UserName;
	this.Id  = user.Id;
};

module.exports = User;

/*
 * 保存一个用户到数据库
 * @param {Function} callback: 执行完数据库操作的应该执行的回调函数
 */
User.prototype.save = function save(callback) {
	var user = {
		name: this.name,
		password: this.password
	};

	var db  = GetConnection(true);
	db.connect();
	var sql = "INSERT INTO `calendar`"+
		"(`Subject`,`Location`,`MasterId`,`Description`,`CalendarType`,`StartTime`,`EndTime`"+
		",`IsAllDayEvent`,`HasAttachment`,`Category`,`InstanceType`,`Attendees`,`AttendeeNames`"+
		",`OtherAttendee`,`UPAccount`,`UPName`,`UPTime`,`RecurringRule`) "+
		"VALUES "+
		"(:Subject,:Location,:MasterId,:Description,:CalendarType,:StartTime,:EndTime"+
		",:IsAllDayEvent,:HasAttachment,:Category,:InstanceType,:Attendees,:AttendeeNames"+
		",:OtherAttendee,:UPAccount,:UPName,:UPTime,:RecurringRule) ";

	db.query(sql,user,function(err,result){

		if(err)
		{
			db.end();
			console.log(err);

			return;
		}
		if(cb)
		{
			cb(result.insertId);
		}
	});

}


/*
 * 查询在集合`users`是否存在一个制定用户名的用户
 * @param {String} username: 需要查询的用户的名字 
 * @param {Function} callback: 执行完数据库操作的应该执行的回调函数
 */
User.get = function get(username, callback) {
	var db  = GetConnection(true);
	db.connect();
	var sql = "SELECT * FROM user where  Account=:account ";
	db.query(sql,{account:username},
		function(err,r){ //数据放回来
			db.end();
			if(err)
			{
				console.log(err);

				return;
			}
			if (r) {

				if(r[0]){
					var user = new User(r[0]);

					callback(err, user);
				}else{
					callback(err, null);
				}
			} else {

			}

		});
};