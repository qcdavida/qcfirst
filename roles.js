const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("student")
 .readOwn("course")
 .updateOwn("course")
 
ac.grant("instructor")
 .extend("student")
 .readAny("course")
 .createAny("course")
 .deleteAny("course")
 
ac.grant("admin")
 .extend("student")
 .extend("instructor")
 .updateAny("course")
 .deleteAny("course")
 .deleteAny("user")
 
return ac;
})();
