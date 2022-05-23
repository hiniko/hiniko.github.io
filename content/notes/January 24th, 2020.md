* [java](../knowledge/programming/java/java.md) 
  * When creating a fat Jar care needs to be taken with any singed .jars
  * Firstly if there are any signatures in META-INF the Jar will not run due to security failures
  * Second if if you exclude the signing files, signed jars will not be loaded at run time due to failing the security check
  * You can exclude the files like so

````groovy
task createServerAppJar(type: ShadowJar) {
	classifier = "server"
	from sourceSets.main.output
	configurations = [project.configurations.runtimeClasspath]
	
	manifest {
		attributes (
			"Main-Class"	:	"uk.shermanrose.utils.HttpServer"
		)
	}

	//	Remove BC signatures which cause other classes to fail to load 
	exclude 'META-INF/*.RSA'
	exclude 'META-INF/*.SF' 
	exclude 'META-INF/*.DSA'
}
````

* There are two other ways. Include your dependancies as jars in your jar, or keep your signed dependencies outside of the fat jar
* assimilate https://stackoverflow.com/a/51455886
* Forget building Fat jars. Distributions are where it's at!
  * Part of Gradles plugins `distribution` handles building all the dependency jars intact, and creating a script `.sh` and `.bat` file to run the application. EASY! 
* \#Buisness Advertising on google
  * https://www.indiehackers.com/article/we-wasted-50k-on-google-ads-so-you-dont-have-to-355a425b27 
