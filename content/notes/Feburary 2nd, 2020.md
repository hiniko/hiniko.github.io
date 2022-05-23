* \#Software Engineering
  * [Engineerring-belieifs](https://blog.wesleyac.com/posts/engineering-beliefs)
  * What do I believe?
* https://about.wtf.studio/mondays/ #Creativity #Work
* [java](../knowledge/programming/java/java.md) #errors
  * Really interesting failure. If the JVM fails to init a class once, it will complain, and 

````shell
16:53:58 Caused by: java.lang.ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2a t starship.mvr.model.NotifyType.<clinit>(NotifyType.java:90)
   ... 9 common frames omitted
Caused by: java.lang.ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2at starship.mvr.model.NotifyType.<clinit>(NotifyType.java:90)
   ... 9 common frames omitted
   
16:54:001. java.lang.NoClassDefFoundError: Could not initialize class starship.mvr.model.NotifyType
1. java.lang.NoClassDefFoundError: Could not initialize class starship.mvr.model.NotifyType
````
