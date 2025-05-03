---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- generated_from_trainer
- dataset_size:38400
- loss:TripletLoss
- loss:ContrastiveLoss
base_model: sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
widget:
- source_sentence: Làm thế nào để cải thiện độ chính xác của mô hình tự động học khi
    làm việc với dữ liệu có cấu trúc cây phức tạp, trong điều kiện tập dữ liệu huấn
    luyện ban đầu bị hạn chế và cần tối ưu quá trình gán nhãn?
  sentences:
  - Nominal set plays a central role in a group-theoretic extension of finite automata
    to those over an infinite set of data values. Moerman et al. proposed an active
    learning algorithm for nominal word automata with the equality symmetry. In this
    paper, we introduce deterministic bottom-up nominal tree automata (DBNTA), which
    operate on trees whose nodes are labelled with elements of an orbit finite nominal
    set. We then prove a Myhill-Nerode theorem for the class of languages recognized
    by DBNTA and propose an active learning algorithm for DBNTA. The algorithm can
    deal with any data symmetry that admits least support, not restricted to the equality
    symmetry and/or the total order symmetry. To prove the termination of the algorithm,
    we define a partial order on nominal sets and show that there is no infinite chain
    of orbit finite nominal sets with respect to this partial order between any two
    orbit finite sets.
  - We introduce the Song Describer dataset (SDD), a new crowdsourced corpus of high-quality
    audio-caption pairs, designed for the evaluation of music-and-language models.
    The dataset consists of 1.1k human-written natural language descriptions of 706
    music recordings, all publicly accessible and released under Creative Common licenses.
    To showcase the use of our dataset, we benchmark popular models on three key music-and-language
    tasks (music captioning, text-to-music generation and music-language retrieval).
    Our experiments highlight the importance of cross-dataset evaluation and offer
    insights into how researchers can use SDD to gain a broader understanding of model
    performance.
  - We present a novel feasibility study on the automatic recognition of Expressed
    Emotion (EE), a family environment concept based on caregivers speaking freely
    about their relative/family member. We describe an automated approach for determining
    the \textit{degree of warmth}, a key component of EE, from acoustic and text features
    acquired from a sample of 37 recorded interviews. These recordings, collected
    over 20 years ago, are derived from a nationally representative birth cohort of
    2,232 British twin children and were manually coded for EE. We outline the core
    steps of extracting usable information from recordings with highly variable audio
    quality and assess the efficacy of four machine learning approaches trained with
    different combinations of acoustic and text features. Despite the challenges of
    working with this legacy data, we demonstrated that the degree of warmth can be
    predicted with an $F_{1}$-score of \textbf{61.5\%}. In this paper, we summarise
    our learning and provide recommendations for future work using real-world speech
    samples.
- source_sentence: Làm thế nào để quản lý khóa bảo mật một cách an toàn và tiện lợi
    khi cần truy cập từ nhiều thiết bị khác nhau?
  sentences:
  - 'Personal cryptographic keys are the foundation of many secure services, but storing
    these keys securely is a challenge, especially if they are used from multiple
    devices. Storing keys in a centralized location, like an Internet-accessible server,
    raises serious security concerns (e.g. server compromise). Hardware-based Trusted
    Execution Environments (TEEs) are a well-known solution for protecting sensitive
    data in untrusted environments, and are now becoming available on commodity server
    platforms.

    Although the idea of protecting keys using a server-side TEE is straight-forward,
    in this paper we validate this approach and show that it enables new desirable
    functionality. We describe the design, implementation, and evaluation of a TEE-based
    Cloud Key Store (CKS), an online service for securely generating, storing, and
    using personal cryptographic keys. Using remote attestation, users receive strong
    assurance about the behaviour of the CKS, and can authenticate themselves using
    passwords while avoiding typical risks of password-based authentication like password
    theft or phishing. In addition, this design allows users to i) define policy-based
    access controls for keys; ii) delegate keys to other CKS users for a specified
    time and/or a limited number of uses; and iii) audit all key usages via a secure
    audit log. We have implemented a proof of concept CKS using Intel SGX and integrated
    this into GnuPG on Linux and OpenKeychain on Android. Our CKS implementation performs
    approximately 6,000 signature operations per second on a single desktop PC. The
    latency is in the same order of magnitude as using locally-stored keys, and 20x
    faster than smart cards.'
  - The problem of constrained coverage path planning involves a robot trying to cover
    maximum area of an environment under some constraints that appear as obstacles
    in the map. Out of the several coverage path planning methods, we consider augmenting
    the linear sweep-based coverage method to achieve minimum energy/ time optimality
    along with maximum area coverage. In addition, we also study the effects of variation
    of different parameters on the performance of the modified method.
  - 'We present a new technique for efficiently removing almost all short cycles in
    a graph without unintentionally removing its triangles. Consequently, triangle
    finding problems do not become easy even in almost $k$-cycle free graphs, for
    any constant $k\geq 4$.

    Triangle finding is at the base of many conditional lower bounds in P, mainly
    for distance computation problems, and the existence of many $4$- or $5$-cycles
    in a worst-case instance had been the obstacle towards resolving major open questions.

    Hardness of approximation: Are there distance oracles with $m^{1+o(1)}$ preprocessing
    time and $m^{o(1)}$ query time that achieve a constant approximation? Existing
    algorithms with such desirable time bounds only achieve super-constant approximation
    factors, while only $3-\epsilon$ factors were conditionally ruled out (Pătraşcu,
    Roditty, and Thorup; FOCS 2012). We prove that no $O(1)$ approximations are possible,
    assuming the $3$-SUM or APSP conjectures. In particular, we prove that $k$-approximations
    require $\Omega(m^{1+1/ck})$ time, which is tight up to the constant $c$. The
    lower bound holds even for the offline version where we are given the queries
    in advance, and extends to other problems such as dynamic shortest paths.

    The $4$-Cycle problem: An infamous open question in fine-grained complexity is
    to establish any surprising consequences from a subquadratic or even linear-time
    algorithm for detecting a $4$-cycle in a graph. We prove that $\Omega(m^{1.1194})$
    time is needed for $k$-cycle detection for all $k\geq 4$, unless we can detect
    a triangle in $\sqrt{n}$-degree graphs in $O(n^{2-\delta})$ time; a breakthrough
    that is not known to follow even from optimal matrix multiplication algorithms.'
- source_sentence: Làm thế nào để đánh giá hiệu suất của các hệ thống lưu trữ dữ liệu
    lớn một cách khách quan và hiệu quả?
  sentences:
  - Data warehouse architectural choices and optimization techniques are critical
    to decision support query performance. To facilitate these choices, the performance
    of the designed data warehouse must be assessed, usually with benchmarks. These
    tools can either help system users comparing the performances of different systems,
    or help system engineers testing the effect of various design choices. While the
    Transaction Processing Performance Council's standard benchmarks address the first
    point, they are not tunable enough to address the second one and fail to model
    different data warehouse schemas. By contrast, our Data Warehouse Engineering
    Benchmark (DWEB) allows generating various ad-hoc synthetic data warehouses and
    workloads. DWEB is implemented as a Java free software that can be interfaced
    with most existing relational database management systems. The full specifications
    of DWEB, as well as experiments we performed to illustrate how our benchmark may
    be used, are provided in this paper.
  - 'Determinant maximization problem gives a general framework that models problems
    arising in as diverse fields as statistics \cite{pukelsheim2006optimal}, convex
    geometry \cite{Khachiyan1996}, fair allocations\linebreak \cite{anari2016nash},
    combinatorics \cite{AnariGV18}, spectral graph theory \cite{nikolov2019proportional},
    network design, and random processes \cite{kulesza2012determinantal}. In an instance
    of a determinant maximization problem, we are given a collection of vectors $U=\{v_1,\ldots,
    v_n\} \subset \RR^d$, and a goal is to pick a subset $S\subseteq U$ of given vectors
    to maximize the determinant of the matrix $\sum_{i\in S} v_i v_i^\top $. Often,
    the set $S$ of picked vectors must satisfy additional combinatorial constraints
    such as cardinality constraint $\left(|S|\leq k\right)$ or matroid constraint
    ($S$ is a basis of a matroid defined on the vectors).

    In this paper, we give a polynomial-time deterministic algorithm that returns
    a $r^{O(r)}$-approximation for any matroid of rank $r\leq d$. This improves previous
    results that give $e^{O(r^2)}$-approximation algorithms relying on $e^{O(r)}$-approximate
    \emph{estimation} algorithms \cite{NikolovS16,anari2017generalization,AnariGV18,madan2020maximizing}
    for any $r\leq d$. All previous results use convex relaxations and their relationship
    to stable polynomials and strongly log-concave polynomials. In contrast, our algorithm
    builds on combinatorial algorithms for matroid intersection, which iteratively
    improve any solution by finding an \emph{alternating negative cycle} in the \emph{exchange
    graph} defined by the matroids. While the $\det(.)$ function is not linear, we
    show that taking appropriate linear approximations at each iteration suffice to
    give the improved approximation algorithm.'
  - Generating value from data requires the ability to find, access and make sense
    of datasets. There are many efforts underway to encourage data sharing and reuse,
    from scientific publishers asking authors to submit data alongside manuscripts
    to data marketplaces, open data portals and data communities. Google recently
    beta released a search service for datasets, which allows users to discover data
    stored in various online repositories via keyword queries. These developments
    foreshadow an emerging research field around dataset search or retrieval that
    broadly encompasses frameworks, methods and tools that help match a user data
    need against a collection of datasets. Here, we survey the state of the art of
    research and commercial systems in dataset retrieval. We identify what makes dataset
    search a research field in its own right, with unique challenges and methods and
    highlight open problems. We look at approaches and implementations from related
    areas dataset search is drawing upon, including information retrieval, databases,
    entity-centric and tabular search in order to identify possible paths to resolve
    these open problems as well as immediate next steps that will take the field forward.
- source_sentence: Làm thế nào để cải thiện độ chính xác của hệ thống dịch tự động
    từ giọng nói sang văn bản mà không cần phụ thuộc vào dữ liệu văn bản gốc?
  sentences:
  - 'Intelligent voice assistants, such as Apple Siri and Amazon Alexa, are widely
    used nowadays. These task-oriented dialogue systems require a semantic parsing
    module in order to process user utterances and understand the action to be performed.
    This semantic parsing component was initially implemented by rule-based or statistical
    slot-filling approaches for processing simple queries; however, the appearance
    of more complex utterances demanded the application of shift-reduce parsers or
    sequence-to-sequence models. Although shift-reduce approaches were initially considered
    the most promising option, the emergence of sequence-to-sequence neural systems
    has propelled them to the forefront as the highest-performing method for this
    particular task. In this article, we advance the research on shift-reduce semantic
    parsing for task-oriented dialogue. We implement novel shift-reduce parsers that
    rely on Stack-Transformers. This framework allows to adequately model transition
    systems on the Transformer neural architecture, notably boosting shift-reduce
    parsing performance. Furthermore, our approach goes beyond the conventional top-down
    algorithm: we incorporate alternative bottom-up and in-order transition systems
    derived from constituency parsing into the realm of task-oriented parsing. We
    extensively test our approach on multiple domains from the Facebook TOP benchmark,
    improving over existing shift-reduce parsers and state-of-the-art sequence-to-sequence
    models in both high-resource and low-resource settings. We also empirically prove
    that the in-order algorithm substantially outperforms the commonly-used top-down
    strategy. Through the creation of innovative transition systems and harnessing
    the capabilities of a robust neural architecture, our study showcases the superiority
    of shift-reduce parsers over leading sequence-to-sequence methods on the main
    benchmark.'
  - We investigate end-to-end speech-to-text translation on a corpus of audiobooks
    specifically augmented for this task. Previous works investigated the extreme
    case where source language transcription is not available during learning nor
    decoding, but we also study a midway case where source language transcription
    is available at training time only. In this case, a single model is trained to
    decode source speech into target text in a single pass. Experimental results show
    that it is possible to train compact and efficient end-to-end speech translation
    models in this setup. We also distribute the corpus and hope that our speech translation
    baseline on this corpus will be challenged in the future.
  - Advanced Persistent Threats (APTs) are a main impendence in cyber security of
    computer networks. In 2015, a successful breach remains undetected 146 days on
    average, reported by [Fi16].With our work we demonstrate a feasible and fast way
    to analyse real world log data to detect breaches or breach attempts. By adapting
    well-known kill chain mechanisms and a combine of a time series database and an
    abstracted graph approach, it is possible to create flexible attack profiles.
    Using this approach, it can be demonstrated that the graph analysis successfully
    detects simulated attacks by analysing the log data of a simulated computer network.
    Considering another source for log data, the framework is capable to deliver sufficient
    performance for analysing real-world data in short time. By using the computing
    power of the graph database it is possible to identify the attacker and furthermore
    it is feasible to detect other affected system components. We believe to significantly
    reduce the detection time of breaches with this approach and react fast to new
    attack vectors.
- source_sentence: Làm thế nào để nhận biết và theo dõi các khái niệm mới xuất hiện
    trong dữ liệu văn bản trước khi chúng trở thành kiến thức phổ biến?
  sentences:
  - 'The outbreak of COVID-19 pandemic has exposed an urgent need for effective contact
    tracing solutions through mobile phone applications to prevent the infection from
    spreading further. However, due to the nature of contact tracing, public concern
    on privacy issues has been a bottleneck to the existing solutions, which is significantly
    affecting the uptake of contact tracing applications across the globe. In this
    paper, we present a blockchain-enabled privacy-preserving contact tracing scheme:
    BeepTrace, where we propose to adopt blockchain bridging the user/patient and
    the authorized solvers to desensitize the user ID and location information. Compared
    with recently proposed contract tracing solutions, our approach shows higher security
    and privacy with the additional advantages of being battery friendly and globally
    accessible. Results show viability in terms of the required resource at both server
    and mobile phone perspectives. Through breaking the privacy concerns of the public,
    the proposed BeepTrace solution can provide a timely framework for authorities,
    companies, software developers and researchers to fast develop and deploy effective
    digital contact tracing applications, to conquer COVID-19 pandemic soon. Meanwhile,
    the open initiative of BeepTrace allows worldwide collaborations, integrate existing
    tracing and positioning solutions with the help of blockchain technology.'
  - Digital holography is a 3D imaging technique by emitting a laser beam with a plane
    wavefront to an object and measuring the intensity of the diffracted waveform,
    called holograms. The object's 3D shape can be obtained by numerical analysis
    of the captured holograms and recovering the incurred phase. Recently, deep learning
    (DL) methods have been used for more accurate holographic processing. However,
    most supervised methods require large datasets to train the model, which is rarely
    available in most DH applications due to the scarcity of samples or privacy concerns.
    A few one-shot DL-based recovery methods exist with no reliance on large datasets
    of paired images. Still, most of these methods often neglect the underlying physics
    law that governs wave propagation. These methods offer a black-box operation,
    which is not explainable, generalizable, and transferrable to other samples and
    applications. In this work, we propose a new DL architecture based on generative
    adversarial networks that uses a discriminative network for realizing a semantic
    measure for reconstruction quality while using a generative network as a function
    approximator to model the inverse of hologram formation. We impose smoothness
    on the background part of the recovered image using a progressive masking module
    powered by simulated annealing to enhance the reconstruction quality. The proposed
    method is one of its kind that exhibits high transferability to similar samples,
    which facilitates its fast deployment in time-sensitive applications without the
    need for retraining the network. The results show a considerable improvement to
    competitor methods in reconstruction quality (about 5 dB PSNR gain) and robustness
    to noise (about 50% reduction in PSNR vs noise increase rate).
  - 'We study how collective memories are formed online. We do so by tracking entities
    that emerge in public discourse, that is, in online text streams such as social
    media and news streams, before they are incorporated into Wikipedia, which, we
    argue, can be viewed as an online place for collective memory. By tracking how
    entities emerge in public discourse, i.e., the temporal patterns between their
    first mention in online text streams and subsequent incorporation into collective
    memory, we gain insights into how the collective remembrance process happens online.
    Specifically, we analyze nearly 80,000 entities as they emerge in online text
    streams before they are incorporated into Wikipedia. The online text streams we
    use for our analysis comprise of social media and news streams, and span over
    579 million documents in a timespan of 18 months. We discover two main emergence
    patterns: entities that emerge in a "bursty" fashion, i.e., that appear in public
    discourse without a precedent, blast into activity and transition into collective
    memory. Other entities display a "delayed" pattern, where they appear in public
    discourse, experience a period of inactivity, and then resurface before transitioning
    into our cultural collective memory.'
pipeline_tag: sentence-similarity
library_name: sentence-transformers
metrics:
- cosine_accuracy
- cosine_accuracy_threshold
- cosine_f1
- cosine_f1_threshold
- cosine_precision
- cosine_recall
- cosine_ap
- cosine_mcc
model-index:
- name: SentenceTransformer based on sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
  results:
  - task:
      type: triplet
      name: Triplet
    dataset:
      name: triplet eval
      type: triplet_eval
    metrics:
    - type: cosine_accuracy
      value: 0.9681249856948853
      name: Cosine Accuracy
  - task:
      type: binary-classification
      name: Binary Classification
    dataset:
      name: binary eval
      type: binary_eval
    metrics:
    - type: cosine_accuracy
      value: 0.90546875
      name: Cosine Accuracy
    - type: cosine_accuracy_threshold
      value: 0.4351062774658203
      name: Cosine Accuracy Threshold
    - type: cosine_f1
      value: 0.9093632958801497
      name: Cosine F1
    - type: cosine_f1_threshold
      value: 0.4334937036037445
      name: Cosine F1 Threshold
    - type: cosine_precision
      value: 0.8989928909952607
      name: Cosine Precision
    - type: cosine_recall
      value: 0.9199757502273416
      name: Cosine Recall
    - type: cosine_ap
      value: 0.9677234802511296
      name: Cosine Ap
    - type: cosine_mcc
      value: 0.8108508280342461
      name: Cosine Mcc
---

# SentenceTransformer based on sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2). It maps sentences & paragraphs to a 384-dimensional dense vector space and can be used for semantic textual similarity, semantic search, paraphrase mining, text classification, clustering, and more.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) <!-- at revision 86741b4e3f5cb7765a600d3a3d55a0f6a6cb443d -->
- **Maximum Sequence Length:** 128 tokens
- **Output Dimensionality:** 384 dimensions
- **Similarity Function:** Cosine Similarity
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/UKPLab/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'max_seq_length': 128, 'do_lower_case': False}) with Transformer model: BertModel 
  (1): Pooling({'word_embedding_dimension': 384, 'pooling_mode_cls_token': False, 'pooling_mode_mean_tokens': True, 'pooling_mode_max_tokens': False, 'pooling_mode_mean_sqrt_len_tokens': False, 'pooling_mode_weightedmean_tokens': False, 'pooling_mode_lasttoken': False, 'include_prompt': True})
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```

Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'Làm thế nào để nhận biết và theo dõi các khái niệm mới xuất hiện trong dữ liệu văn bản trước khi chúng trở thành kiến thức phổ biến?',
    'We study how collective memories are formed online. We do so by tracking entities that emerge in public discourse, that is, in online text streams such as social media and news streams, before they are incorporated into Wikipedia, which, we argue, can be viewed as an online place for collective memory. By tracking how entities emerge in public discourse, i.e., the temporal patterns between their first mention in online text streams and subsequent incorporation into collective memory, we gain insights into how the collective remembrance process happens online. Specifically, we analyze nearly 80,000 entities as they emerge in online text streams before they are incorporated into Wikipedia. The online text streams we use for our analysis comprise of social media and news streams, and span over 579 million documents in a timespan of 18 months. We discover two main emergence patterns: entities that emerge in a "bursty" fashion, i.e., that appear in public discourse without a precedent, blast into activity and transition into collective memory. Other entities display a "delayed" pattern, where they appear in public discourse, experience a period of inactivity, and then resurface before transitioning into our cultural collective memory.',
    "Digital holography is a 3D imaging technique by emitting a laser beam with a plane wavefront to an object and measuring the intensity of the diffracted waveform, called holograms. The object's 3D shape can be obtained by numerical analysis of the captured holograms and recovering the incurred phase. Recently, deep learning (DL) methods have been used for more accurate holographic processing. However, most supervised methods require large datasets to train the model, which is rarely available in most DH applications due to the scarcity of samples or privacy concerns. A few one-shot DL-based recovery methods exist with no reliance on large datasets of paired images. Still, most of these methods often neglect the underlying physics law that governs wave propagation. These methods offer a black-box operation, which is not explainable, generalizable, and transferrable to other samples and applications. In this work, we propose a new DL architecture based on generative adversarial networks that uses a discriminative network for realizing a semantic measure for reconstruction quality while using a generative network as a function approximator to model the inverse of hologram formation. We impose smoothness on the background part of the recovered image using a progressive masking module powered by simulated annealing to enhance the reconstruction quality. The proposed method is one of its kind that exhibits high transferability to similar samples, which facilitates its fast deployment in time-sensitive applications without the need for retraining the network. The results show a considerable improvement to competitor methods in reconstruction quality (about 5 dB PSNR gain) and robustness to noise (about 50% reduction in PSNR vs noise increase rate).",
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 384]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities.shape)
# [3, 3]
```

<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

## Evaluation

### Metrics

#### Triplet

* Dataset: `triplet_eval`
* Evaluated with [<code>TripletEvaluator</code>](https://sbert.net/docs/package_reference/sentence_transformer/evaluation.html#sentence_transformers.evaluation.TripletEvaluator)

| Metric              | Value      |
|:--------------------|:-----------|
| **cosine_accuracy** | **0.9681** |

#### Binary Classification

* Dataset: `binary_eval`
* Evaluated with [<code>BinaryClassificationEvaluator</code>](https://sbert.net/docs/package_reference/sentence_transformer/evaluation.html#sentence_transformers.evaluation.BinaryClassificationEvaluator)

| Metric                    | Value      |
|:--------------------------|:-----------|
| cosine_accuracy           | 0.9055     |
| cosine_accuracy_threshold | 0.4351     |
| cosine_f1                 | 0.9094     |
| cosine_f1_threshold       | 0.4335     |
| cosine_precision          | 0.899      |
| cosine_recall             | 0.92       |
| **cosine_ap**             | **0.9677** |
| cosine_mcc                | 0.8109     |

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Datasets

#### Unnamed Dataset

* Size: 12,800 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>sentence_2</code>
* Approximate statistics based on the first 1000 samples:
  |         | sentence_0                                                                         | sentence_1                                                                           | sentence_2                                                                           |
  |:--------|:-----------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------|
  | type    | string                                                                             | string                                                                               | string                                                                               |
  | details | <ul><li>min: 21 tokens</li><li>mean: 39.66 tokens</li><li>max: 79 tokens</li></ul> | <ul><li>min: 37 tokens</li><li>mean: 126.26 tokens</li><li>max: 128 tokens</li></ul> | <ul><li>min: 40 tokens</li><li>mean: 125.44 tokens</li><li>max: 128 tokens</li></ul> |
* Samples:
  | sentence_0                                                                                                                                                                                                                                                                                                         | sentence_1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | sentence_2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
  |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | <code>Làm thế nào để đánh giá hiệu quả của các thuật toán nâng cao chất lượng ảnh trong điều kiện thực tế?</code>                                                                                                                                                                                                  | <code>Over the past decades, various super-resolution (SR) techniques have been developed to enhance the spatial resolution of digital images. Despite the great number of methodical contributions, there is still a lack of comparative validations of SR under practical conditions, as capturing real ground truth data is a challenging task. Therefore, current studies are either evaluated 1) on simulated data or 2) on real data without a pixel-wise ground truth.<br>To facilitate comprehensive studies, this paper introduces the publicly available Super-Resolution Erlangen (SupER) database that includes real low-resolution images along with high-resolution ground truth data. Our database comprises image sequences with more than 20k images captured from 14 scenes under various types of motions and photometric conditions. The datasets cover four spatial resolution levels using camera hardware binning. With this database, we benchmark 15 single-image and multi-frame SR algorithms. Our experiments quantit...</code> | <code>Deep learning is ubiquitous across many areas areas of computer vision. It often requires large scale datasets for training before being fine-tuned on small-to-medium scale problems. Activity, or, in other words, action recognition, is one of many application areas of deep learning. While there exist many Convolutional Neural Network architectures that work with the RGB and optical flow frames, training on the time sequences of 3D body skeleton joints is often performed via recurrent networks such as LSTM.<br>In this paper, we propose a new representation which encodes sequences of 3D body skeleton joints in texture-like representations derived from mathematically rigorous kernel methods. Such a representation becomes the first layer in a standard CNN network e.g., ResNet-50, which is then used in the supervised domain adaptation pipeline to transfer information from the source to target dataset. This lets us leverage the available Kinect-based data beyond training on a single dataset and...</code>    |
  | <code>Làm thế nào để xử lý lượng lớn dữ liệu thực thể một cách hiệu quả mà vẫn đảm bảo độ chính xác khi thời gian và tài nguyên tính toán bị giới hạn Trong điều kiện phải làm việc với các nguồn dữ liệu không đồng nhất, liệu có phương pháp nào có thể áp dụng lược đồ linh hoạt để cải thiện hiệu suất?</code> | <code>Entity Resolution (ER) is the task of finding entity profiles that correspond to the same real-world entity. Progressive ER aims to efficiently resolve large datasets when limited time and/or computational resources are available. In practice, its goal is to provide the best possible partial solution by approximating the optimal comparison order of the entity profiles. So far, Progressive ER has only been examined in the context of structured (relational) data sources, as the existing methods rely on schema knowledge to save unnecessary comparisons: they restrict their search space to similar entities with the help of schema-based blocking keys (i.e., signatures that represent the entity profiles). As a result, these solutions are not applicable in Big Data integration applications, which involve large and heterogeneous datasets, such as relational and RDF databases, JSON files, Web corpus etc. To cover this gap, we propose a family of schema-agnostic Progressive ER methods, which do n...</code>    | <code>Pattern matching on large graphs is the foundation for a variety of application domains. Strict latency requirements and continuously increasing graph sizes demand the usage of highly parallel in-memory graph processing engines that need to consider non-uniform memory access (NUMA) and concurrency issues to scale up on modern multiprocessor systems. To tackle these aspects, graph partitioning becomes increasingly important. Hence, we present a technique to process graph pattern matching on NUMA systems in this paper. As a scalable pattern matching processing infrastructure, we leverage a data-oriented architecture that preserves data locality and minimizes concurrency-related bottlenecks on NUMA systems. We show in detail, how graph pattern matching can be asynchronously processed on a multiprocessor system.</code>                                                                                                                                                                                               |
  | <code>Làm thế nào để tối ưu hóa việc truyền dữ liệu từ các thiết bị theo dõi động vật trong điều kiện băng thông hạn chế mà vẫn đảm bảo độ chính xác của thông tin sinh thái học?</code>                                                                                                                           | <code>Bio-loggers, electronic devices used to track animal behaviour through various sensors, have become essential in wildlife research.<br>Despite continuous improvements in their capabilities, bio-loggers still face significant limitations in storage, processing, and data transmission due to the constraints of size and weight, which are necessary to avoid disturbing the animals.<br>This study aims to explore how selective data transmission, guided by machine learning, can reduce the energy consumption of bio-loggers, thereby extending their operational lifespan without requiring hardware modifications.</code>                                                                                                                                                                                                                                                                                                                                                                                                                 | <code>T-distributed stochastic neighbor embedding (tSNE) is a popular and prize-winning approach for dimensionality reduction and visualizing high-dimensional data. However, tSNE is non-parametric: once visualization is built, tSNE is not designed to incorporate additional data into existing representation. It highly limits the applicability of tSNE to the scenarios where data are added or updated over time (like dashboards or series of data snapshots).<br>In this paper we propose, analyze and evaluate LION-tSNE (Local Interpolation with Outlier coNtrol) - a novel approach for incorporating new data into tSNE representation. LION-tSNE is based on local interpolation in the vicinity of training data, outlier detection and a special outlier mapping algorithm. We show that LION-tSNE method is robust both to outliers and to new samples from existing clusters. We also discuss multiple possible improvements for special cases.<br>We compare LION-tSNE to a comprehensive list of possible benchmark approach...</code> |
* Loss: [<code>TripletLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#tripletloss) with these parameters:
  ```json
  {
      "distance_metric": "TripletDistanceMetric.COSINE",
      "triplet_margin": 0.5
  }
  ```

#### Unnamed Dataset

* Size: 25,600 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>label</code>
* Approximate statistics based on the first 1000 samples:
  |         | sentence_0                                                                         | sentence_1                                                                           | label                                                          |
  |:--------|:-----------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------|:---------------------------------------------------------------|
  | type    | string                                                                             | string                                                                               | float                                                          |
  | details | <ul><li>min: 21 tokens</li><li>mean: 40.09 tokens</li><li>max: 80 tokens</li></ul> | <ul><li>min: 28 tokens</li><li>mean: 126.39 tokens</li><li>max: 128 tokens</li></ul> | <ul><li>min: 0.0</li><li>mean: 0.52</li><li>max: 1.0</li></ul> |
* Samples:
  | sentence_0                                                                                                                                                                         | sentence_1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | label            |
  |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------|
  | <code>Làm thế nào để tối ưu hóa thuật toán tìm đường đi ngắn nhất trong đồ thị có trọng số khi thời gian tính toán trọng số cạnh là yếu tố quan trọng cần xem xét?</code>          | <code>The shortest path problem in graphs is fundamental to AI. Nearly all variants of the problem and relevant algorithms that solve them ignore edge-weight computation time and its common relation to weight uncertainty. This implies that taking these factors into consideration can potentially lead to a performance boost in relevant applications. Recently, a generalized framework for weighted directed graphs was suggested, where edge-weight can be computed (estimated) multiple times, at increasing accuracy and run-time expense. We build on this framework to introduce the problem of finding the tightest admissible shortest path (TASP); a path with the tightest suboptimality bound on the optimal cost. This is a generalization of the shortest path problem to bounded uncertainty, where edge-weight uncertainty can be traded for computational cost. We present a complete algorithm for solving TASP, with guarantees on solution quality. Empirical evaluation supports the effectiveness of this approac...</code> | <code>1.0</code> |
  | <code>Làm thế nào để thiết kế bộ nhân xấp xỉ tiết kiệm năng lượng cho các thiết bị IoT khi yêu cầu độ chính xác có thể linh hoạt và tài nguyên phần cứng bị giới hạn?</code>       | <code>Given the stringent requirements of energy efficiency for Internet-of-Things edge devices, approximate multipliers, as a basic component of many processors and accelerators, have been constantly proposed and studied for decades, especially in error-resilient applications. The computation error and energy efficiency largely depend on how and where the approximation is introduced into a design. Thus, this article aims to provide a comprehensive review of the approximation techniques in multiplier designs ranging from algorithms and architectures to circuits. We have implemented representative approximate multiplier designs in each category to understand the impact of the design techniques on accuracy and efficiency. The designs can then be effectively deployed in high-level applications, such as machine learning, to gain energy efficiency at the cost of slight accuracy loss.</code>                                                                                                                       | <code>1.0</code> |
  | <code>Làm thế nào để cải thiện tính tự nhiên trong giọng nói tổng hợp khi hệ thống hiện tại thường tạo ra ngữ điệu đơn điệu do phụ thuộc vào dữ liệu huấn luyện trung bình?</code> | <code>This work presents a SystemC-TLM based simulator for a RISC-V microcontroller. This simulator is focused on simplicity and easy expandable of a RISC-V. It is built around a full RISC-V instruction set simulator that supports full RISC-V ISA and extensions M, A, C, Zicsr and Zifencei. The ISS is encapsulated in a TLM-2 wrapper that enables it to communicate with any other TLM-2 compatible module. The simulator also includes a very basic set of peripherals to enable a complete SoC simulator. The running code can be compiled with standard tools and using standard C libraries without modifications. The simulator is able to correctly execute the riscv-compliance suite. The entire simulator is published as a docker image to ease its installation and use by developers. A porting of FreeRTOSv10.2.1 for the simulated SoC is also published.</code>                                                                                                                                                                  | <code>0.0</code> |
* Loss: [<code>ContrastiveLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#contrastiveloss) with these parameters:
  ```json
  {
      "distance_metric": "SiameseDistanceMetric.COSINE_DISTANCE",
      "margin": 0.5,
      "size_average": true
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `eval_strategy`: steps
- `per_device_train_batch_size`: 64
- `per_device_eval_batch_size`: 64
- `num_train_epochs`: 1
- `multi_dataset_batch_sampler`: round_robin

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `overwrite_output_dir`: False
- `do_predict`: False
- `eval_strategy`: steps
- `prediction_loss_only`: True
- `per_device_train_batch_size`: 64
- `per_device_eval_batch_size`: 64
- `per_gpu_train_batch_size`: None
- `per_gpu_eval_batch_size`: None
- `gradient_accumulation_steps`: 1
- `eval_accumulation_steps`: None
- `torch_empty_cache_steps`: None
- `learning_rate`: 5e-05
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `max_grad_norm`: 1
- `num_train_epochs`: 1
- `max_steps`: -1
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: {}
- `warmup_ratio`: 0.0
- `warmup_steps`: 0
- `log_level`: passive
- `log_level_replica`: warning
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `save_safetensors`: True
- `save_on_each_node`: False
- `save_only_model`: False
- `restore_callback_states_from_checkpoint`: False
- `no_cuda`: False
- `use_cpu`: False
- `use_mps_device`: False
- `seed`: 42
- `data_seed`: None
- `jit_mode_eval`: False
- `use_ipex`: False
- `bf16`: False
- `fp16`: False
- `fp16_opt_level`: O1
- `half_precision_backend`: auto
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `local_rank`: 0
- `ddp_backend`: None
- `tpu_num_cores`: None
- `tpu_metrics_debug`: False
- `debug`: []
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_prefetch_factor`: None
- `past_index`: -1
- `disable_tqdm`: False
- `remove_unused_columns`: True
- `label_names`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `fsdp`: []
- `fsdp_min_num_params`: 0
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `tp_size`: 0
- `fsdp_transformer_layer_cls_to_wrap`: None
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `deepspeed`: None
- `label_smoothing_factor`: 0.0
- `optim`: adamw_torch
- `optim_args`: None
- `adafactor`: False
- `group_by_length`: False
- `length_column_name`: length
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `skip_memory_metrics`: True
- `use_legacy_prediction_loop`: False
- `push_to_hub`: False
- `resume_from_checkpoint`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_private_repo`: None
- `hub_always_push`: False
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `include_inputs_for_metrics`: False
- `include_for_metrics`: []
- `eval_do_concat_batches`: True
- `fp16_backend`: auto
- `push_to_hub_model_id`: None
- `push_to_hub_organization`: None
- `mp_parameters`: 
- `auto_find_batch_size`: False
- `full_determinism`: False
- `torchdynamo`: None
- `ray_scope`: last
- `ddp_timeout`: 1800
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `include_tokens_per_second`: False
- `include_num_input_tokens_seen`: False
- `neftune_noise_alpha`: None
- `optim_target_modules`: None
- `batch_eval_metrics`: False
- `eval_on_start`: False
- `use_liger_kernel`: False
- `eval_use_gather_object`: False
- `average_tokens_across_devices`: False
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: round_robin

</details>

### Training Logs
| Epoch | Step | triplet_eval_cosine_accuracy | binary_eval_cosine_ap |
|:-----:|:----:|:----------------------------:|:---------------------:|
| 0.5   | 100  | 0.9609                       | 0.9544                |
| 1.0   | 200  | 0.9681                       | 0.9677                |


### Framework Versions
- Python: 3.11.11
- Sentence Transformers: 3.4.1
- Transformers: 4.51.1
- PyTorch: 2.5.1+cu124
- Accelerate: 1.3.0
- Datasets: 3.5.0
- Tokenizers: 0.21.0

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

#### TripletLoss
```bibtex
@misc{hermans2017defense,
    title={In Defense of the Triplet Loss for Person Re-Identification},
    author={Alexander Hermans and Lucas Beyer and Bastian Leibe},
    year={2017},
    eprint={1703.07737},
    archivePrefix={arXiv},
    primaryClass={cs.CV}
}
```

#### ContrastiveLoss
```bibtex
@inproceedings{hadsell2006dimensionality,
    author={Hadsell, R. and Chopra, S. and LeCun, Y.},
    booktitle={2006 IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR'06)},
    title={Dimensionality Reduction by Learning an Invariant Mapping},
    year={2006},
    volume={2},
    number={},
    pages={1735-1742},
    doi={10.1109/CVPR.2006.100}
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->