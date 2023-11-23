Recreation of the coleweight backend using mongodb and express. The code is bad, it's just a proof of concept. Local testing seems fine and calculations looks correct. 

Since this is not a relase depo but a shitty dev one. Don't bother reading commit messages or checking the flow, it's bad.


TODO : 
    - Need input sanitization to avoid nosql injection for wr.
    -Same for routes. Since it will be importable to cw mode. This could lead to RCE in the mod if not handled.
    - Need to add proper routing instead of this shitty system. Also need to use HTTP verbs correctly instead of spamming get routes
    
