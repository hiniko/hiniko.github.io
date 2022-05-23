* Universal links in ios
  * https://developer.apple.com/documentation/safariservices/supporting_associated_domains_in_your_app?language=objc
  * Important to note the change of the schema in iOS 13, as well as the change of location for the file. However there is no schema version in the document so it becomes a case of managing endpoints
  * Also the [json](../knowledge/programming/json/json.md) itself has variable keys, something I think that should be avoided like the plague as it make parsing code of the document a lot more fraught, and more difficult in something strongly typed like [java](../knowledge/programming/java/java.md)
  * In the end as we are only reading a base file, we can get away with typing the "routes" part of the schema as a `JsonElement` to preserve the keys during deserialisation, however under different circumstances...
* `sysdiagnose`
* Apparently a system level tool that collects data ( including #AASA data apprently)
  * Best way to trigger it now is to assign a single tap Assistive Touch button on the phone that is bound to `Analytics`. This will start dumping the data.
  * After in `Settings -> Privacy -> Analytics and Improvements -> Analytics Data` With the prefix sysdiagnoise with a time stamp, are the logs.
  * They are pretty big (200MB+) In this case, so you *should* be able to #AirDrop them off. But lets be honest when does that ever work...
