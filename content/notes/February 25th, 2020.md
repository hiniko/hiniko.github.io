* [data_structures](../knowledge/programming/data-structures/data_structures.md)
  * Checking membership of a large set quickly! Using hashes  to set bits in a #bit_vector in order to test if an element may be in a set. This could be used as a filter for more expensive tests to hone down on a positive data set. some of the three filters can be tuned and dialed in for performance /  memory constraints and to fit certain data sets. 
    * Bloom Filter - https://llimllib.github.io/bloomfilter-tutorial/
    * xor Filter - https://lemire.me/blog/2019/12/19/xor-filters-faster-and-smaller-than-bloom-filters/
      * Apparently faster and more memory concise, but slower to build tables no updating (but easy to rebuild)
    * Cukoo Filter  https://en.wikipedia.org/wiki/Cuckoo_filter
