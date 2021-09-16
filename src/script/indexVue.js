var usernameGlobal = ''

Vue.component('post', {
    props: ['descriptor', 'globals'],
    data: function() {
        return {
            currentuser: this.globals.currentuser,
            nbLikes: this.descriptor.nb_likes,
            nbDislikes: this.descriptor.nb_dislikes,
            liked: false,
            disiked: true,
            pdp: this.descriptor.photo,
            likesrc: "images/like3.png",
            dislikesrc: "images/dislike3.png",
            DateInter: '',
            showUserInfo: false,
            userwholiked: [],
            initLord: true,
            booleanLD: '',
            followorunfollow: 'Follow'
        }
    },
    methods: {
        changePdp: function() {
            axios.post('/pdp', {
                pid: this.descriptor.pid,
            }).then((response) => {
                this.globals.pdp = response.data;
            }).catch(error => {});
        },

        displayinfoevent: function() {
            if (this.showUserInfo) {
                this.showUserInfo = false;
            } else {
                this.showUserInfo = false;
                this.showUserInfo = true;
            }
        },

        hideevent: function() {
            this.showUserInfo = false;
        },
        BoxErrorConnect: function() { // quand on clique sur j'aime ou suivre sans être connecté
            this.globals.clickButDiconnected = true;
        },
        followorunfollowevent: function() {
            if (this.followorunfollow == 'Follow') {
                this.followevent();
            } else if (this.followorunfollow == 'Unfollow') {
                this.unfollowevent();
            }
        },
        followevent: function() {
            if (this.globals.connected) {
                this.followorunfollow = 'Unfollow';
                axios.put('/abonnement', {
                    toFollow: this.descriptor.uid,
                    username: usernameGlobal
                }).then(response => console.log(response)).catch(error => {
                    console.log("error")
                });
            } else {
                this.BoxErrorConnect();
            }
        },
        unfollowevent: function() {
            if (this.globals.connected) {
                this.followorunfollow = 'Follow';
                axios.put('/desabonnement', {
                    toUnfollow: this.descriptor.uid,
                    username: usernameGlobal
                }).then(response => console.log(response)).catch(error => {
                    console.log("error")
                });
            } else {
                this.BoxErrorConnect();
            }
        },

        initializeLikeDislike: function() {

            axios.post('/tablord', {
                username: this.globals.currentuser,
                pid: this.descriptor.pid
            }).then((response) => {
                this.tablordDisplay(response);
            }).catch(error => {
                console.log("error tablord")
            });


        },

        tablordDisplay: function(key) {

            if (key.data.includes(this.descriptor.pid)) {


                this.likesrc = "images/like5.png";
                this.liked = true;

            }
        },

        likeevent: function(e) {
            if (this.globals.connected) {

                this.liked = !this.liked;
                var pid = e.target.parentElement.parentElement.getElementsByClassName('pid')[0].innerHTML;

                if (this.liked) {

                    axios.post('/addinfo', {
                        username: this.globals.currentuser,
                        pidpubli: this.descriptor.pid,
                        lordvalue: "true"
                    }).then(response => console.log(response)).catch(error => {
                        console.log("error addinfo")
                    });

                    this.nbLikes++;
                    this.likesrc = "images/like5.png";

                    axios.put('/addlike', {
                        pid: pid
                    }).then(response => console.log(response)).catch(error => {
                        console.log("error")
                    });

                    if (this.disliked) {
                        this.disliked = false;
                        this.dislikesrc = "images/dislike3.png";
                        if (this.nbDislikes > 0) this.nbDislikes--;

                        axios.put('/removedislike', {
                            pid: pid
                        }).then(response => console.log(response)).catch(error => {
                            console.log("errordisco2")
                        });
                    }
                } else {
                    this.nbLikes--;
                    this.liked = false;
                    this.likesrc = "images/like3.png";

                    axios.post('/removeinfo', {
                        username: this.globals.currentuser,
                        pidpubli: this.descriptor.pid,
                    }).then(response => console.log(response)).catch(error => {
                        console.log("error removeinfo")
                    });


                    axios.put('/removelike', {
                        pid: pid
                    }).then(response => console.log(response)).catch(error => {
                        console.log("error")
                    });
                }
            } else {
                this.BoxErrorConnect();
            }
        },

        dislikeevent: function(e) {
            if (this.globals.connected) {

                this.disliked = !this.disliked;
                var pid = e.target.parentElement.parentElement.getElementsByClassName('pid')[0].innerHTML;

                if (this.disliked) {

                    axios.post('/addinfo', {
                        username: this.globals.currentuser,
                        pidpubli: this.descriptor.pid,
                        lordvalue: "false"
                    }).then(response => console.log(response)).catch(error => {
                        console.log("error addinfo")
                    });

                    this.nbDislikes++;
                    this.dislikesrc = "images/dislike4.png";

                    axios.put('/adddislike', {
                        pid: pid
                    }).then(response => console.log(response)).catch(error => {
                        console.log("errordisco")
                    });
                    if (this.liked) {
                        this.liked = false;
                        this.likesrc = "images/like3.png";
                        if (this.nbLikes > 0) this.nbLikes--;

                        axios.put('/removelike', {
                            pid: pid
                        }).then(response => console.log(response)).catch(error => {
                            console.log("error")
                        });
                    }
                } else {

                    axios.post('/removeinfo', {
                        username: this.globals.currentuser,
                        pidpubli: this.descriptor.pid,
                    }).then(response => console.log(response)).catch(error => {
                        console.log("error removeinfo")
                    });

                    this.nbDislikes--;
                    this.disliked = false;
                    this.dislikesrc = "images/dislike3.png";

                    axios.put('/removedislike', {
                        pid: pid
                    }).then(response => console.log(response)).catch(error => {
                        console.log("errordisco2")
                    });
                }
            } else {
                this.BoxErrorConnect();
            }
        },
    },

    computed: {
        getDateFormatPost: function() {
            return this.descriptor.datep;
        },

        since: function() {
            this.DateInter = new Date(this.descriptor.datep);
            const datepubli = this.globals.now - this.DateInter;

            const convdatepubli = Math.trunc(datepubli / 1000);

            const nbminute = Math.trunc(convdatepubli / 60);
            const nbheure = Math.trunc(convdatepubli / 3600);
            const nbday = Math.trunc(convdatepubli / 86400);
            const nbweek = Math.trunc(convdatepubli / 604800);
            const nbmonth = Math.trunc(convdatepubli / 2592000);
            const nbyear = Math.trunc(convdatepubli / (2592000 * 12));

            if (nbminute < 1) return "Il y a moins d'une minute ";
            if (nbminute == 1) return "Il y a 1 minute";
            if (nbheure < 1) return "Il y a " + nbminute + " minutes ";
            if (nbheure == 1) return "Il y a 1 heure";
            if (nbday < 1) return "Il y a " + nbheure + " heures ";
            if (nbday == 1) return "Il y a 1 jour";
            if (nbweek < 1) return "Il y a " + nbday + " jours ";
            if (nbweek == 1) return "Il y a 1 semaine";
            if (nbmonth < 1) return "Il y a " + nbweek + " semaines ";
            if (nbmonth == 1) return "Il y a 1 mois";
            if (nbyear < 1) return "Il y a " + nbmonth + " mois ";
            if (nbyear == 1) return "Il y a 1 an";
            return "Il y a " + nbyear + " ans ";
        },

    },

    mounted: function() {

        var n = 0;

        setInterval(() => {

            if (this.globals.connected == true && n < 1) {

                this.initializeLikeDislike();
                n++;
            }

            if (this.globals.connected == false) {

                n = 0;
                this.liked = false;
                this.disliked = false;
                this.likesrc = "images/like3.png";
                this.dislikesrc = "images/dislike3.png";


            }


        }, 500);


        setInterval(() => {


            this.pdp = this.globals.pdp;
            this.DateInter = this.descriptor.datep;

        }, 10);



    },
    created: function() {
        this.changePdp();

    },
    template: `
    <div class="divmsg">
        <div class="pid" style="display: none;">{{descriptor.pid}}</div>
        <div class="userinfo" v-show="showUserInfo" v-on:click="hideevent">

			<div class="datainfo" >
				<ul>
					<li>
						0
						<span>publications</span>
					</li>
					<li>
						0
						<span>abonnés</span>
					</li>
					<li>
						0
						<span>abonnements</span>
                    </li>
                    <li>
                        
                    <div class="divfollow">

                         <p class="followtxt" v-on:click="followorunfollowevent"> {{followorunfollow}} </p>

                    </div>
						
					</li>
                </ul>  
            </div>
        </div>

        <div class="msginfos">
            <div class="divavatar">
                <img class="useravatar" v-bind:src=this.descriptor.photo alt="avatar" v-on:click="displayinfoevent" >

                <span class="nb1"> {{nbLikes}} </span> 
                <img src="images/like5.png" class="minilike" alt="minilike"> 

                <span class="nb2"> {{nbDislikes}} </span>
                <img src="images/dislike4.png" class="minidislike" alt="minidislike"> 
            </div>

            <div class="divinfosuser" v-on:click="hideevent">
                <p class="msgusername">  {{descriptor.pseudo}} &nbsp;  </p>  
                <p class="horodatagetime"> {{since}} </p>
            </div>
        </div>

        <div class="divcontent" v-on:click="hideevent">
            <p class="msgcontent"> {{descriptor.contenu}} </p> 
        </div>

        <div class="heartdiv" v-on:click="hideevent">
            <img class="likeimg" v-on:click="likeevent" v-bind:src="likesrc" alt="like">
            <img class="dislikeimg"  v-on:click="dislikeevent" v-bind:src="dislikesrc" alt="dislike">
        </div>
    </div>`
});

var app = new Vue({
    el: '#app',
    data: {
        globals: {
            pdp: "",
            now: Date.now(),
            connected: false,
            showFormSpecial: false,
            clickButDiconnected: false,
            currentuser: '',
        },

        ErrorEditValue: '',
        ErrorSignValue: '',
        ErrorLogValue: '',
        showEditError: false,
        showSignError: false,
        showLogError: false,
        pdpSelect: "",
        showEditProfile: false,
        showEditAvatar: false,
        showEdit: false,
        nightChecked: '',
        toDisable: false,
        showFormSign: false,
        showFormLog: false,
        showSuccess: false,
        showHide: true,
        showAlert: false,
        showSuccess2: false,
        showHide2: true,
        showAlert2: false,
        showFILTER: false,
        showLOGOUT: false,
        showINPUT: false,
        showAVATAR: false,
        mindtxt: "Quelque chose à dire ?",
        posts: [],
        messageToAdd: "",
        username: "",
        usernameEdit: "",
        passwordEdit: "",
        passwordEditConf: "",
        usernameRegistration: "",
        emailRegistration: "",
        passwordRegistration: "",
        passwordRegistrationConf: "",
        usernameConnection: "",
        passwordConnection: "",
        temp: '',
        response: {},
        checked: '',
        checkbox1: false,
        checkbox2: false,
        checkbox3: true,
        checkbox4: false,
        checkbox5: false,
        search1: '',
        search2: ''
    },

    computed: {
        funcfunc: function() {
            return {
                show: this.showSuccess,
                alert: this.showAlert,
                hide: this.showHide
            }
        },
        funcfunc2: function() {
            return {
                show2: this.showSuccess2,
                alert2: this.showAlert2,
                hide2: this.showHide2
            }
        },
        funcfunc3: function() {
            return {

            }
        },
        disablefunction: function() {
            return {
                disableclass: this.toDisable,
            }
        },
    },

    mounted: function() {
        setInterval(() => {
            this.refreshDisplay();
            this.globals.now = Date.now();
            if (this.globals.clickButDiconnected) this.ErrorBox();
        }, 500);
    },

    methods: {

        findEvent1: function() {

            this.displaySearch1();

        },
        findEvent2: function() {

            this.displaySearch2();


        },
        subPdp: function() {

            axios.post('/pdp2', {
                username: this.usernameConnection,
                pdpsrc: this.pdpSelect
            }).then((response) => {


            }).catch(error => {
                console.log("error change new pdp");
            });



        },
        select: function(event) {
            var target = event.currentTarget.src;
            this.pdpSelect = target;
        },
        changeProfileEvent: function() {

            this.showEditAvatar = false;
            this.showEditProfile = !this.showEditProfile;
        },
        changeAvatarEvent: function() {

            this.showEditProfile = false;
            this.showEditAvatar = !this.showEditAvatar;
        },
        editEvent: function() {

            this.showEdit = !this.showEdit;
        },
        nightModeActivate: function() { // event pour le switch night mode 

        },
        DISABLE: function() {
            this.toDisable = !this.toDisable;
        },
        closeForm: function() {

            this.showFormLog = false;
            this.showFormSign = false;
            this.showEdit = false;
            this.showEditProfile = false;
            this.showEditAvatar = false;
            this.showLogError = false;
            this.showSignError = false;
        },
        showform1: function() {

            this.showFormSign = false;
            this.showFormLog = true;

        },
        showform2: function() {

            this.showFormLog = false;
            this.showFormSign = true;

        },
        SuccessBox: function() {
            this.showSuccess = true;
            this.showHide = false;
            this.showAlert = true;

            setTimeout(function() {
                this.showHide = true;
                this.showSuccess = false;
            }.bind(this), 3000);
        },
        ErrorBox: function() {
            this.showSuccess2 = true;
            this.showHide2 = false;
            this.showAlert2 = true;

            setTimeout(function() {
                this.showHide2 = true;
                this.showSuccess2 = false;
            }.bind(this), 1300);

            this.globals.clickButDiconnected = false;
        },
        disconnectUser: function() {
            this.globals.connected = false;
            this.closeForm();
            this.showLOGOUT = false;
            this.showINPUT = false;
            this.showAVATAR = false;
            this.showFILTER = false;
            this.showEdit = false;

            var displayBTN1 = document.getElementById("loginbtn");
            displayBTN1.style.display = '';
            var displayBTN2 = document.getElementById("signupbtn");
            displayBTN2.style.display = '';
        },
        registeredDisplay: function(key) {
            if (key.data == "L'ajout de l'utilisateur s'est bien passé.") {
                this.closeForm();
                this.SuccessBox();
            }
            if (key.data == "PseudoE") {
                this.ErrorSignValue = "Pseudo déjà utilisé !";
                this.showSignError = true;
            }
            if (key.data == "EmailE") {
                this.ErrorSignValue = "Adresse mail déjà utilisée !";
                this.showSignError = true;
            }
        },
        editDisplay: function(key) {

            if (key.data == "PseudoE") {
                this.ErrorEditValue = "Pseudo déjà utilisé !";
                this.showEditError = true;
            }
            if (key.data == "modifsuccess") {
                this.ErrorEditValue = "";
                this.showEditError = false;
                this.usernameConnection = this.usernameEdit;
                this.closeForm();
            }
        },
        registerUser: function() {
            var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

            if (format.test(this.usernameRegistration)) {
                this.ErrorSignValue = "Veuillez choisir un Pseudo valide !";
                this.showSignError = true;
                return;
            }
            if (this.usernameRegistration.length < 4 || this.usernameRegistration.length > 20) {
                this.ErrorSignValue = "Veuillez choisir un Pseudo entre 4 et 20 caractères !";
                this.showSignError = true;
                return;
            }
            if (!this.emailRegistration.includes("@")) {
                this.ErrorSignValue = "Veuillez saisir une adresse mail valide !";
                this.showSignError = true;
                return;
            }
            if (this.passwordRegistration.length < 5 || this.passwordRegistration.length > 15) {
                this.ErrorSignValue = "Veuillez choisir un mot de passe entre 5 et 15 caractères !";
                this.showSignError = true;
                return;
            }
            if (this.passwordRegistration != this.passwordRegistrationConf) {
                this.ErrorSignValue = "Les 2 mots de passes ne sont pas les mêmes !";
                this.showSignError = true;
                return;
            }
            axios.post('/register', {
                username: this.usernameRegistration,
                email: this.emailRegistration,
                password: this.passwordRegistration,
                passwordConf: this.passwordRegistrationConf
            }).then((response) => {
                this.registeredDisplay(response);
            }).catch(error => {
                console.log("error register")
            });
        },
        editUser: function() {
            var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

            if (this.usernameEdit.length < 4 || this.usernameEdit.length > 20) {
                this.ErrorEditValue = "Veuillez choisir un Pseudo entre 4 et 20 caractères !";
                this.showEditError = true;
                return;
            }
            if (format.test(this.usernameEdit)) {
                this.ErrorEditValue = "Veuillez choisir un Pseudo valide !";
                this.showEditError = true;
                return;
            }
            if (this.passwordEdit.length < 5 || this.passwordEdit.length > 15) {
                this.ErrorEditValue = "Veuillez choisir un mot de passe entre 5 et 15 caractères !";
                this.showEditError = true;
                return;
            }
            if (this.passwordEdit != this.passwordEditConf) {
                this.ErrorEditValue = "Les 2 mots de passes ne sont pas les mêmes !";
                this.showEditError = true;
                return;
            }
            axios.post('/edit', {
                currentusername: this.usernameConnection,
                username: this.usernameEdit,
                password: this.passwordEdit,
                passwordConf: this.passwordEditConf
            }).then((response) => {
                this.editDisplay(response);
            }).catch(error => {
                console.log("error edit");
            });

        },
        connectedDisplay: function(key) {
            if (key.status == 200) {

                this.changePdpEdit();

                this.globals.currentuser = this.usernameConnection;
                this.globals.connected = true;
                this.showINPUT = true;
                this.showAVATAR = true;
                this.showLOGOUT = true;
                this.showFILTER = true;
                this.showLogError = false;

                this.mindtxt = "Quelque chose à dire " + key.data + " ? ";

                var displayFORM = document.getElementById("logform");
                displayFORM.style.display = 'none';

                this.checkbox2 = true;
                this.checkbox5 = true;
            }
        },
        connectUser: function() {
            axios.post('/connect', {
                username: this.usernameConnection,
                password: this.passwordConnection
            }).then((response) => {
                this.connectedDisplay(response);
            }).catch(error => {
                console.log("error connexion");
                this.ErrorLogValue = "Nom d'utilisateur ou mot de passe incorrect";
                this.showLogError = true;
            });
            usernameGlobal = this.usernameConnection;
        },
        getPostsInfos: function(url) {
            axios.put(url).then(response => this.posts = response.data).catch(error => {
                console.log("error")
            });
        },
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        refreshDisplay: function() {
            if (this.checkbox2) {
                axios.put('/mentions', {
                    username: this.usernameConnection,
                    posts: this.posts
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            }
            if (this.checkbox3) {
                axios.put('/everyone', {
                    posts: this.posts
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            }
            if (this.checkbox5) {
                axios.put('/following', {
                    mentions: this.checkbox2,
                    everyone: this.checkbox3,
                    username: this.usernameConnection,
                    posts: this.posts
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            }
        },
        sendPostInfos: function() {
            if (this.messageToAdd.length > 0) {
                var request = new XMLHttpRequest();

                request.onreadystatechange = function() {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        var confirmation = this.responseText;
                        console.log(confirmation);
                    }
                }
                var name = this.usernameConnection;

                var fulldate = new Date();
                var dateYear = fulldate.getFullYear();
                var dateMonth = fulldate.getMonth() + 1;
                var dateDay = fulldate.getDate();

                var dateHour = fulldate.getHours();
                var dateMinute = fulldate.getMinutes();
                var dateSeconds = fulldate.getSeconds();

                if (dateMonth < 10) dateMonth = "0" + dateMonth;
                if (dateDay < 10) dateDay = "0" + dateDay;

                if (dateMinute < 10) dateMinute = "0" + dateMinute;
                if (dateHour < 10) dateHour = "0" + dateHour;
                if (dateSeconds < 10) dateSeconds = "0" + dateSeconds;

                var d = dateYear + "-" + dateMonth + "-" + dateDay;
                var t = dateHour + ":" + dateMinute + ":" + dateSeconds;

                var all = d + " " + t;
                var date = all.split(/[- :]/);

                request.open("POST", "/add", true);
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                request.send("username=" + name + "&message=" + this.messageToAdd + "&date=" + date);
            } else {
                alert("Vous devez insérer du texte pour poster !");
            }
            this.messageToAdd = "";
        },
        displaySearch1: function() {

            if (this.search1 == '') {
                this.posts = [];

                this.checkbox2 = false;
                this.checkbox3 = false;
                this.checkbox5 = false;
            } else {
                axios.put('/search1', {
                    username: this.search1,
                    posts: this.posts
                }).then(response => {
                    if (response.data.length > 0) {
                        this.posts = response.data;
                        this.checkbox2 = false;
                        this.checkbox3 = false;
                        this.checkbox5 = false;
                    }
                }).catch(error => {
                    console.log("error")
                });
            }
        },
        displaySearch2: function() {

            if (this.search2.charAt(0) == '#' && this.search2 != '#') {
                axios.put('/search2', {
                    hashtag: this.search2,
                    posts: this.posts
                }).then(response => {
                    if (response.data.length > 0) {
                        this.posts = response.data;
                        this.checkbox2 = false;
                        this.checkbox3 = false;
                        this.checkbox5 = false;
                    }
                }).catch(error => {
                    console.log("error")
                });
            } else if (this.search2 == '') {
                this.posts = [];
                this.checkbox2 = false;
                this.checkbox3 = false;
                this.checkbox5 = false;
            }
        },
        displayUserTagged: function() {
            if (!this.checkbox2) {
                this.checkbox2 = true;

                axios.put('/mentions', {
                    username: this.usernameConnection,
                    posts: this.posts
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            } else {
                this.checkbox2 = false;

                axios.delete('/mentions', {
                    data: {
                        username: this.usernameConnection,
                        posts: this.posts
                    }
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            }
        },
        displayEveryoneTagged: function() {
            if (!this.checkbox3) {
                this.checkbox3 = true;

                axios.put('/everyone', {
                    posts: this.posts
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            } else {
                this.checkbox3 = false;

                axios.delete('/everyone', {
                    data: {
                        posts: this.posts
                    }
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            }
        },
        displayFollowing: function() {
            if (!this.checkbox5) {
                this.checkbox5 = true;

                axios.put('/following', {
                    username: this.usernameConnection,
                    posts: this.posts
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            } else {
                this.checkbox5 = false;

                axios.delete('/following', {
                    data: {
                        username: this.usernameConnection,
                        posts: this.posts
                    }
                }).then(response => this.posts = response.data).catch(error => {
                    console.log("error")
                });
            }
        },
        changePdpEdit: function() {
            axios.post('/pdpp', {
                username: this.usernameConnection
            }).then((response) => {

            }).catch(error => {
                console.log("error initpdp");
            });
        },
    },
    created: function() {}
})