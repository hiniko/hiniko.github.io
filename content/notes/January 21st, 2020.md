# Java Executor pools

````java
private static final int NUM_THREADS = 4;private final Logger log = Logger.getLogger(getClass());
	 

private LinkedBlockingQueue< Runnable> taskQueue = new LinkedBlockingQueue< Runnable>();private List< Runnable> running = Collections.synchronizedList(new ArrayList());

public void doSomeStuffConcurrently() {
    Executor executor = 
        new ThreadPoolExecutor(NUM_THREADS, NUM_THREADS,
            0L, TimeUnit.MILLISECONDS,
            taskQueue,
          	Executors.defaultThreadFactory()) 
    {

        @Override
        protected < T> RunnableFuture< T> newTaskFor(final Runnable runnable, T value) {
            return new FutureTask< T>(runnable, value) {
                @Override
                public String toString() {
                    return runnable.toString();
                }
            };
        }

        @Override
        protected void beforeExecute(Thread t, Runnable r) {
            super.beforeExecute(t, r);
            running.add(r);
        }

        @Override
        protected void afterExecute(Runnable r, Throwable t) {
            super.afterExecute(r, t);
            running.remove(r);
            log.info("RUNNING: " + running);
        }
    };

    executor.execute(new Runnable() {

        @Override
        public void run() {
            // so some stuff
        }

        @Override
        public String toString() {
            return "describe the task here!";
        }                        
    });}
````

* Only real way to know what is going on is to have a custom interface that allow naming of tasks. [Source](https://www.richardnichols.net/2012/01/how-to-get-the-running-tasks-for-a-[[Java]]-executor/) 
* Doing a controlled shutdown can look like this 

````java
		int retries = 5;
		_implementation.shutdown();

		try
		{
			while (!_implementation.awaitTermination(1000, TimeUnit.MILLISECONDS))
			{
				int activeCount = _implementation.getQueue().size();
				if (--retries > 0)
				{
						log.warn("Waiting for {} queued tasks", activeCount);
				}
				else
				{
					log.warn("Aborting {} queued tasks", activeCount);
					break;
				}	
			}
			log.warn("Finished");
		}
		catch (InterruptedException e)
		{
			log.error("Interrupted while awaiting termination");
		}
````

* `ScheduledThreadPoolExecutor` has two importing settings: `continueExistingPeriodicTasksAfterShutdown` and `executeExistingDelayedTasksAfterShutdown` which exhibit what would be the expected *correct* behavior during a shutdown, do not run any tasks that are delayed or periodic. 
  - Also `awaitTermination` returns on timeout but does not forceably close. Can loop around and keep attempting if need be
* \#GameDev Aspirations:
  * https://www.allenchou.net/gamedev-tutorials-series/
* Code #Reading
  * https://www.justindfuller.com/2020/01/why-do-we-fall-into-the-rewrite-trap/
    * Recommends books + how to deal with my current bad #refactor habit. Am I working off Tech debt, or making bad decisions. Often the scope of the things changed by my actions are far far greater then I could have anticipated. By the time I realise the consequence of time, effort and affected systems. it's blackout and lose a week or commit.
  * https://medium.com/@mikhail.barash.mikbar/grammars-for-programming-languages-fae3a72a22c6 
    * quite involved this one lots of links
* https://www.linusakesson.net/music/reverberations/ #Music #eletronics
  * Interesting post + small album about simulating organs with two SID chips and a commodore 64
