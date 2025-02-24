document.addEventListener('alpine:init', () => {
    Alpine.data('gallery', () => ({
        randomImgUrl:["https://ferrari-view.thron.com/api/xcontents/resources/delivery/getThumbnail/ferrari/400x400/c21600fb-9447-4e0f-87aa-08fc90b10c23.jpg?v=367","https://ferrari-cdn.thron.com/api/xcontents/resources/delivery/getThumbnail/ferrari/400x400/38a0205e-00a6-4ac3-8bb4-9d22259a49e9.jpg?v=361","https://ferrari-cdn.thron.com/api/xcontents/resources/delivery/getThumbnail/ferrari/400x400/b378fa6a-1838-4e0d-b265-9e9c778edfd9.jpg?v=371","https://ferrari-cdn.thron.com/api/xcontents/resources/delivery/getThumbnail/ferrari/400x400/78a38f9c-89eb-4de8-b6a4-5410a06ad088.jpg?v=212","http://ferrari-view.thron.com/api/xcontents/resources/delivery/getThumbnail/ferrari/400x400/584e65fa-69ff-4b81-acf5-998535d89d29.jpg?v=367"],
        // randomImgUrl:["https://ferrari-cdn.thron.com/static/UMHOCR_0_FERRARI_167_COMBINATION_FILM_16X9_FINAL_9R8W69.mp4"],
        contents: [],
        selectedContents: [],
        selectAll: false,
        loading: false,
        page: 1,
        perPage: 10,
        unsplashApiKey: "c4Zh1VHp6WeGk6PUhv_3i_xpz_M6D_5qsmq1Bmi5C1g",

        isModalOpen: false,
        currentIndex: 0,
        zoomLevel: 1,

        get currentContent() {
            return this.contents[this.currentIndex] || {};
        },

        async fetchContents() {
            if (this.loading) return;
            this.loading = true;

            try {
                const response = await fetch(`https://api.unsplash.com/search/photos?query=ferrari&page=${this.page}&per_page=${this.perPage}&client_id=${this.unsplashApiKey}`);
                const data = await response.json();
                const dataVideo = [
                    {
                        url: "https://s7g10.scene7.com/is/content/ferraristage/HTJHK7_APP-Ferrari_SF90Stradale_768x1024-2000_YLEGP6+%281%29",
                        thumbnailUrl: "https://s7g10.scene7.com/is/image/ferraristage/HTJHK7_APP-Ferrari_SF90Stradale_768x1024-2000_YLEGP6+%281%29-AVS",
                        nameTitle: "HTJHK7_APP-Ferrari_SF90Stradale_768x1024-2000_YLEGP6 (1).mp4"
                    },
                    {
                        url: "https://s7g10.scene7.com/is/content/ferraristage/0_FERRARI_167_BEAUTY_FILM_FINAL",
                        thumbnailUrl: "https://s7g10.scene7.com/is/image/ferraristage/0_FERRARI_167_BEAUTY_FILM_FINAL-AVS",
                        nameTitle: "0_FERRARI_167_BEAUTY_FILM_FINAL.mp4"
                    },
                    {
                        url: "https://s7g10.scene7.com/is/content/ferraristage/SF90+SPIDER+%281%29",
                        thumbnailUrl: "https://s7g10.scene7.com/is/image/ferraristage/SF90+SPIDER+%281%29-AVS",
                        nameTitle: "SF90 SPIDER (1).mp4"
                    }
                ];
                

                // this.contents = [...this.contents, ...data.results.map(img => ({
                //     id: img.id,
                //     url: "https://ferrari-view.thron.com/api/xcontents/resources/delivery/getThumbnail/ferrari/400x400/c21600fb-9447-4e0f-87aa-08fc90b10c23.jpg?v=367",
                //     title: img.alt_description || "Ferrari Image",
                //     filetype: 'JPG',
                // }))];

                this.contents = [
                    ...this.contents,
                    ...data.results.map(img => {
                        // const randomIndex = Math.floor(Math.random() * this.randomImgUrl.length);
                        const randomIndex = Math.floor(Math.random() * dataVideo.length);
                        return {
                            id: img.id,

                            // url: this.randomImgUrl[randomIndex],
                            //inerisci l'url di scene7 in caso di video
                            url: dataVideo[randomIndex].url,
                            thumbnailUrl:  dataVideo[randomIndex].thumbnailUrl,
                            title: dataVideo[randomIndex].nameTitle,
                            // title: img.alt_description || 'Ferrari image',
                            contentType: 'video',
                            filetype: 'mp4',
                        };
                    })
                ];


                this.page++;
            } catch (error) {
                console.error("Errore nel recupero delle immagini:", error);
            } finally {
                this.loading = false;
            }
        },

        handleScroll() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                this.fetchContents();
            }
        },

        toggleAll(event) {
            this.selectedContents = event.target.checked ? this.contents.map(img => img.id) : [];
        },

        async downloadSelected() {
            if (!this.selectedContents.length) return alert("Nessuna immagine selezionata.");

            let zip = new JSZip();
            let imgFolder = zip.folder("ferrari_international_media_test_drive");

            await Promise.all(this.selectedContents.map(async (contentId) => {
                let content = this.contents.find(img => img.id === contentId);
                if (content) {
                    try {
                        let response = await fetch(content.url);
                        let blob = await response.blob();
                        imgFolder.file(content.title.replace(/\s+/g, "_") + "." + content.filetype, blob);
                    } catch (error) {
                        console.error("Errore nel download di", content.url, error);
                    }
                }
            }));

            zip.generateAsync({ type: "blob" }).then(content => saveAs(content, "ferrari_international_media_test_drive.zip"));
        },

        openModal(index) {
            this.currentIndex = index;
            this.zoomLevel = 1;
            this.isModalOpen = true;
        },

        closeModal() {
            this.isModalOpen = false;
        },

        nextContent() {
            this.currentIndex = (this.currentIndex + 1) % this.contents.length;
            this.zoomLevel = 1;
        },

        prevContent() {
            this.currentIndex = (this.currentIndex - 1 + this.contents.length) % this.contents.length;
            this.zoomLevel = 1;
        },

        zoom(event) {
            let scaleStep = 0.1;
            if (event.deltaY < 0 && this.zoomLevel < 5) {
                this.zoomLevel += scaleStep;
            } else if (event.deltaY > 0 && this.zoomLevel > 1) {
                this.zoomLevel -= scaleStep;
            }
        },

        downloadContent() {
            fetch(this.currentContent.url)
                .then(res => res.blob())
                .then(blob => saveAs(blob, this.currentContent.title + "." + this.currentContent.filetype))
                .catch(error => console.error("Errore nel download:", error));
        }
    }));
});