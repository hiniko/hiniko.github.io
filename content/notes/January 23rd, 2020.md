* \#self_improvment
  * Why Procrastination is about managing emotions, not time https://www.bbc.com/worklife/article/20200121-why-procrastination-is-about-managing-emotions-not-time
* Web of Documents vs Web of Applications
  - http://blog.danieljanus.pl/2019/10/07/web-of-documents/
* [HTTP](../knowledge/programming/http/HTTP.md)
  * https://daniel.haxx.se/blog/2019/03/12/looking-for-the-refresh-header/ The refresh header never existed!
* [java](../knowledge/programming/java/java.md) 
  * Building jars is still fun... even better with `[[Gradle]]` Though it is possible to get a nice config with a great manifest file 

````groovy
task createServerAppJar(type: ShadowJar) {
	group "vTime"
	description "Create a .jar of tools"
	baseName  "vTimeServer-${getGitHash}"
	classifier "server"

	from sourceSets.main.output
	configurations = [project.configurations.runtimeClasspath]
	
	manifest {
        attributes(
            'Built-By'       : System.properties['user.name'],
            'Build-Timestamp': LocalDateTime.now(),
            'Build-Revision' : getGitHash(),
            'Created-By'     : "Gradle ${Gradle.GradleVersion}",
            'Build-Jdk'      : "${System.properties['Java.version']} (${System.properties['Java.vendor']} ${System.properties['Java.vm.version']})",
            'Build-OS'       : "${System.properties['os.name']} ${System.properties['os.arch']} ${System.properties['os.version']}",
            'Main-Class'	 : 'starship.mvr.utils.HttpServer',
            'Class-Path'	 : project.configurations.runtimeClasspath.collect { it.getName() }.join(' ')
        )
    }
}
````

* Also you can get the commit has with this ditty

````groovy
def getGitHash = { ->
    def stdout = new ByteArrayOutputStream()
    exec {
        commandLine 'git', 'rev-parse', '--short', 'HEAD'
        standardOutput = stdout
    }
    return stdout.toString().trim()
}
````
