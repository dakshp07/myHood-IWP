module.exports.profile = function(req,res){
    return res.render('profile',{
        title: 'profile',
    })
}

module.exports.settings = function(req,res){
        return res.render('settings',{
        title: 'settings',
    })
}
