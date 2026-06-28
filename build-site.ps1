$ErrorActionPreference = 'Stop'

$pages = @(
    @{
        File = 'index.html'
        Partials = @(
            '/partials/home/hero.html',
            '/partials/home/overview.html',
            '/partials/home/value.html',
            '/partials/home/contact-section.html'
        )
    },
    @{
        File = 'about-us\index.html'
        Partials = @(
            '/partials/about/hero.html',
            '/partials/about/mission.html',
            '/partials/about/story.html',
            '/partials/about/process.html',
            '/partials/about/team.html',
            '/partials/about/cta.html'
        )
    },
    @{
        File = 'solutions\index.html'
        Partials = @(
            '/partials/solutions/hero.html',
            '/partials/solutions/process.html',
            '/partials/solutions/cta.html'
        )
    },
    @{
        File = 'impact\index.html'
        Partials = @(
            '/partials/impact/hero.html',
            '/partials/impact/metrics.html',
            '/partials/impact/verification.html',
            '/partials/impact/cta.html'
        )
    },
    @{
        File = 'contact-us\index.html'
        Partials = @(
            '/partials/contact/hero.html',
            '/partials/contact/form.html'
        )
    }
)

function Get-IncludeMarkup {
    param([string[]] $Partials)

    $markup = @(
        '                <div class="sticky-trigger"></div><!---->',
        '                <div class="top-blocks--sticky top-blocks" data-include="/partials/navbar.html"></div>'
    )

    foreach ($partial in $Partials) {
        $markup += "                <div data-include=""$partial"" data-include-replace></div>"
    }

    $markup += '                <div data-include="/partials/footer.html" data-include-replace></div>'

    return [string]::Join("`r`n", $markup)
}

foreach ($page in $pages) {
    $html = Get-Content -LiteralPath $page.File -Raw

    if ($html -notmatch '/js/include-partials\.js') {
        $html = $html.Replace('</head>', "    <script src=""/js/include-partials.js"" defer></script>`r`n</head>")
    }

    $includeMarkup = Get-IncludeMarkup -Partials $page.Partials
    $pattern = '(?s)(<main\b[^>]*>).*?(</main>)'
    $html = [regex]::Replace(
        $html,
        $pattern,
        { param($match) $match.Groups[1].Value + "`r`n" + $includeMarkup + "`r`n            " + $match.Groups[2].Value },
        1
    )

    Set-Content -LiteralPath $page.File -Value $html -NoNewline -Encoding UTF8
    Write-Host "Built split page $($page.File)"
}
